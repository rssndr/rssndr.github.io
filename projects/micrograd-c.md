# micrograd.c

A tiny autograd engine coded in C

## Source Code

Github: [micrograd.c](https://github.com/rssndr/micrograd.c)

## Description

micrograd.c is a C implementation of a tiny autograd engine, inspired by Andrej Karpathy's micrograd.
The autograd engine handles automatic differentiation, enabling the computation of gradients for tensor operations such as addition, multiplication, power, and ReLU activation. The neural network components include neurons, layers, and multi-layer perceptrons (MLPs) for building and training models.

## Training Loop

In the training loop, the code performs forward passes to compute the outputs and the loss, followed by a backward pass to compute gradients. The parameters are then updated using the Adam optimizer.

## Tests

The tests validate the functionality of the autograd engine and neural network components. They check the correctness of gradient computations, forward and backward passes, and overall network behavior.

