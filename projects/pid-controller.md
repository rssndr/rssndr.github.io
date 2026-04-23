# PID Controller

Building a Quadcopter Flight Controller from Scratch

GitHub repo: <a href="https://github.com/rssndr/PID-controller" target="_blank">PID Controller</a> <br>
Last update: 2026/04/23

## PID Control in C

Over the last few weeks I’ve been developing a realistic quadcopter simulation in C. What started as a simple object falling under gravity has become a stable, disturbance-resistant altitude controller.

This post explains the project, introduces PID control, and shows how I translated the mathematics into C code.

### What is PID Control?

**PID** stands for **Proportional-Integral-Derivative**. It is the most widely used feedback controller in robotics, drones, and industrial systems.

The core idea is to compute a control output based on the **error** $ e(t) $ = $ \text{setpoint} - \text{measured value}$.

The classic continuous form is:

$$
u(t) = K_p \cdot e(t) + K_i \int_0^t e(\tau) \, d\tau + K_d \frac{de(t)}{dt}
$$

- **Proportional term** ($K_p$): reacts to the current error
- **Integral term** ($K_i$): eliminates steady-state offset
- **Derivative term** ($K_d$): damps future behavior by looking at the rate of change

In discrete time (our simulation runs at 200 Hz), we approximate the integral and derivative as:

$$
\text{integral} \leftarrow \text{integral} + e \cdot dt
$$

$$
\text{derivative} = \frac{e_{\text{now}} - e_{\text{prev}}}{dt}
$$

The final output becomes:

$$
\text{output} = K_p \cdot e + K_i \cdot \text{integral} - K_d \cdot \text{derivative}
$$

### My PID Implementation in C

Here’s the core of my `pid_update()` function (from `pid.c`):

```c
float pid_update(PID_Controller* pid, float feedback, uint32_t now_ms) {
    // ... dt calculation and clamping ...

    float error = pid->setpoint - feedback;

    float integral_new = pid->integral + error * dt;           // ← Integral term

    float derivative = (feedback - pid->prev_feedback) / dt;   // ← Derivative term

    float output = pid->kp * error
                 + pid->ki * pid->integral                    // ← Use previous integral
                 - pid->kd * derivative;

    // Anti-windup with back-calculation
    pid->integral_clamped = 0;
    if (output > pid->output_max) {
        output = pid->output_max;
        if (error > 0) {
            integral_new = pid->integral;
            pid->integral_clamped = 1;
        }
    } else if (output < pid->output_min) {
        output = pid->output_min;
        if (error < 0) {
            integral_new = pid->integral;
            pid->integral_clamped = 1;
        }
    }

    if (!pid->integral_clamped) {
        pid->integral = integral_new;
    }

    pid->prev_feedback = feedback;
    pid->prev_time_ms = now_ms;

    return output;
}
````

Note how I deliberately use `pid->integral` (the value from the previous step) in the output calculation — this is the correct discrete PID form. I also added proper anti-windup to prevent integral wind-up during saturation.

#### Simulation Setup

The physics are simple rigid-body dynamics:

```c
float az = (thrust / MASS) - GRAVITY;
quad.vz += az * dt;
quad.z  += quad.vz * dt;
```

I chose realistic values for a small FPV drone:

* Mass = 0.25 kg
* Thrust scaling = 0.005 N per PID unit
* Maximum command = 2000 (giving ~4:1 thrust-to-weight ratio)

#### Tuned Gains and Performance

After extensive tuning I settled on:

```c
pid_init(&altitude_pid, 1300.0f, 1000.0f, 200.0f, 100.0f, 2000.0f);
altitude_pid.setpoint = 1.0f;
```

**Results**:

* Rise time (0 → 90%): ~0.60 s
* Overshoot: ~4%
* Steady-state error: < 0.0001 m

I also added a 100 ms wind gust at t = 8.0 s (equivalent to ~20 N force). The drone climbs sharply, fights back, and returns to the 1.0 m setpoint smoothly.

#### Live Visualization

To make development more insightful, I built a live plotting tool in Python using Matplotlib. It shows altitude, vertical velocity, and thrust command in real time, with the wind gust highlighted in red.

You can launch both the simulation and live graph with a single command:

```bash
./run.sh
```

![](/assets/demo.gif)

#### Lessons Learned

* Correct discrete PID implementation is subtle but critical (especially the integral handling).
* Proper scaling of gains and thrust factor dramatically affects behavior.
* Anti-windup is essential when the actuator saturates.
* Visualization is worth its weight in gold for debugging control systems.

#### Next Steps

The altitude controller is now solid. Next I will implement:

* Cascaded angle → rate control for roll and pitch
* Yaw rate control
* Full 4-motor mixing
* 3D visualization and eventually real hardware on an ESP32

