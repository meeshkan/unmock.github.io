---
id: stacks
title: Stacks
sidebar_label: Stacks
---

A group of services initialized to a variety of states is called a "stack" in Unmock. The name stack corresponds to our intuitive understanding, as coders, of what a stack is - we mash together a bunch of useful things that support whatever we're trying to write.

In general, there should be a one-to-one correspondance between tests and stacks in Unmock. It is *never* a good idea to let one stack span multiple tests, and you have to bend Unmock significantly to do something like add a user in test X and have that user present in test Y. However, you sometimes *do* want several stacks to be present in one test. For example, if your test verifies e-mail automation over a thirty-day trial of a product, you may want to substitute in and out several different pre-defined stacks representing each day an email is sent.

Unmock stacks are controlled  with the `unmock.stack` object, which help save, recall, push, and pop stacks. The toplevel `unmock` object also allows you to configure global qualities of your stack, such as the whole network being down, the network having a delay, or TCP packets arriving in a bizarre order.