# micrograd.c

A tiny autograd engine coded in C

## Source Code

Github: [micrograd.c](https://github.com/rssndr/micrograd.c)

## Introduction

Micrograd.c is a C implementation of Andrej Karpathy's Python-based micrograd library, which supports automatic differentiation and neural network training. I created micrograd.c to understand backpropagation and neural networks by rebuilding them in a low-level language. Unlike Python, C lacks classes and automatic memory management, requiring explicit design of the computational graph and manual resource handling.

This post explains the theory of automatic differentiation, the project's structure, how the engine and neural network work, the training process, and the challenges of implementing it in C.

## The Theory: Automatic Differentiation and Backpropagation

Backpropagation computes gradients of a loss function to update neural network parameters (weights and biases) via the chain rule. Automatic differentiation (autograd) automates this by building a computational graph during the forward pass and traversing it backward to compute gradients. Micrograd.c uses reverse-mode autograd for scalar-valued functions, ideal for loss optimization.

Key concepts:

- **Computational Graph**: Operations (e.g., add, mul) create nodes with values, gradients, and parent pointers.
- **Forward Pass**: Computes outputs, builds graph.
- **Backward Pass**: Sets output gradient to 1, propagates derivatives backward using chain rule.

Supported operations:

- **Addition**: \( c = a + b \), gradients: \( \frac{\partial c}{\partial a} = 1 \), \( \frac{\partial c}{\partial b} = 1 \).
- **Multiplication**: \( c = a \times b \), gradients: \( \frac{\partial c}{\partial a} = b \), \( \frac{\partial c}{\partial b} = a \).
- **Power**: \( c = a^b \), gradient: \( \frac{\partial c}{\partial a} = b \cdot a^{b-1} \).
- **Leaky ReLU**: \( c = \max(0, a) \) or \( 0.01 \cdot a \) if negative, gradient: 1 if \( a > 0 \), else 0.01.

Neurons compute weighted sums plus bias, with optional ReLU. Layers form multi-layer perceptrons (MLPs). Loss (e.g., mean squared error) is minimized via optimizers like Adam.

## Project Structure

micrograd.c is a lightweight library with no external dependencies beyond standard C libraries and `<math.h>`. Files:

- **engine.h / engine.c**: Autograd core (Value struct, operations, backprop).
- **nn.h / nn.c**: Neural network (neurons, layers, MLPs).
- **test_engine.c**: Tests operations and combined expressions.
- **test_nn.c**: Tests MLP init, forward/backward passes, and training.

Run tests: `make && ./test_engine && ./test_nn`.

## How the Engine Works

The `Value` struct in `engine.h` defines graph nodes:

```c
typedef struct Value {
    double data;                        // scalar value
    double grad;                        // gradient
    struct Value* prev[2];              // parent pointers (binary ops)
    char op[10];                        // operation name
    void (*backward)(struct Value*);    // backprop function
} Value;
```

### Operations

`create_value(double data)` allocates a `Value`. Operations build the graph:

Addition:

```c
Value* add(Value* a, Value* b) {
    Value* out = create_value(a->data + b->data);
    out->prev[0] = a;
    out->prev[1] = b;
    strcpy(out->op, "+");
    out->backward = add_backward;
    return out;
}

void add_backward(Value* out) {
    out->prev[0]->grad += out->grad;
    out->prev[1]->grad += out->grad;
}
```

Multiplication:

```c
Value* mul(Value* a, Value* b) {
    Value* out = create_value(a->data * b->data);
    out->prev[0] = a;
    out->prev[1] = b;
    strcpy(out->op, "*");
    out->backward = mul_backward;
    return out;
}

void mul_backward(Value* out) {
    out->prev[0]->grad += out->prev[1]->data * out->grad;
    out->prev[1]->grad += out->prev[0]->data * out->grad;
}
```

Power and leaky ReLU are similar, with gradients computed via chain rule. Helpers (`sub`, `truediv`) compose from primitives.

### Backpropagation

`backward(Value* v)` performs topological sort and gradient propagation:

```c
void backward(Value* v) {
    const int max_nodes = 1000000;
    Value** topo = malloc(max_nodes * sizeof(Value*));
    Value** visited = malloc(max_nodes * sizeof(Value*));
    int topo_size = 0, visited_size = 0;
    build_topo(v, topo, &topo_size, visited, &visited_size);
    v->grad = 1.0;
    for (int i = topo_size - 1; i >= 0; i--) {
        if (topo[i]->backward != NULL) {
            topo[i]->backward(topo[i]);
        }
    }
    free(topo);
    free(visited);
}
```

`build_topo` uses stack-based DFS, ensuring correct order. Fixed-size arrays limit graph size but simplify allocation.

## Neural Network Components

### Neurons

`Neuron` struct:

```c
typedef struct {
    Value **w;               // weights
    Value *b;                // bias
    int n_inputs;
    NeuronConfig config;    // nonlin flag
} Neuron;
```

`neuron_init` allocates weights (random \[-1,1\]), bias (0). `neuron_call`:

```c
Value* neuron_call(Neuron *neuron, Value **x) {
    Value **products = malloc(neuron->n_inputs * sizeof(Value*));
    for (int i = 0; i < neuron->n_inputs; i++) {
        products[i] = mul(neuron->w[i], x[i]);
    }
    Value *act = products[0];
    for (int i = 1; i < neuron->n_inputs; i++) {
        act = add(act, products[i]);
    }
    act = add(act, neuron->b);
    if (neuron->config.nonlin == 1) act = relu(act);
    free(products);
    return act;
}
```

### Layers and MLPs

`Layer` holds neurons; `MLP` holds layers. `mlp_init` sets sizes, applies ReLU to hidden layers:

```c
void mlp_init(MLP *mlp, int nin, int *nouts, int nouts_len) {
    int *sizes = malloc((nouts_len + 1) * sizeof(int));
    sizes[0] = nin;
    for (int i = 0; i < nouts_len; i++) sizes[i+1] = nouts[i];
    mlp->layers = malloc(nouts_len * sizeof(Layer));
    for (int i = 0; i < nouts_len; i++) {
        NeuronConfig config = {.nonlin = (i != nouts_len - 1)};
        layer_init(&mlp->layers[i], sizes[i], sizes[i+1], config);
    }
    free(sizes);
}
```

`mlp_call` chains layers, freeing intermediates.

## Training and Testing

`test_engine.c` verifies operations.

`test_nn.c` tests a 3-4-4-1 MLP with targets \[1,-1,-1,1\]:

- **Init**: Verifies 57 params.
- **Forward**: Checks output size (1).
- **Backward**: Confirms non-zero grads.
- **Training**: 200 epochs, Adam (lr=0.02), MSE loss. Prints losses, final preds.

Loss decreases (e.g., \~1 to &lt;0.01), showing learning.

## Technical Challenges in C

C's low-level nature posed challenges:

1. **No Classes**:

   - Used structs (`Value`, `Neuron`) with function pointers instead of classes. Explicit functions (`neuron_call`, `mlp_call`) replaced methods, making code verbose but clear.
   - Example: `Value`'s `backward` pointer mimics method dispatch.

2. **Memory Management**:

   - Manual `malloc`/`free` for every `Value`, array, struct. `neuron_call` frees temp arrays; `_free` functions (e.g., `mlp_free`) cascade cleanup. Null checks prevent crashes.

3. **Graph Traversal**:

   - Fixed-size arrays (1M nodes) in `backward` avoid realloc. Stack-based DFS ensures order.

4. **Debugging**:

   - Relied on `repr` and tests. Floats needed careful handling (e.g., `power`).

5. **Optimizer**:

   - Adam uses manual arrays for moments, with epoch-based bias correction.

## Conclusion

Micrograd.c is a lightweight C library that implements automatic differentiation and neural network training, replicating the core functionality of Karpathy’s micrograd. It provides a clear view of backpropagation and neural network mechanics through explicit graph construction and the Adam optimizer. The project includes tests to verify operations and training on a toy dataset. Check the code and run tests at [micrograd.c on GitHub](https://github.com/rssndr/micrograd.c). Suggestions or issues are welcome via GitHub.

