import time
import sys
from modulino import (
    ModulinoKnob,
    ModulinoThermo,
    ModulinoButtons,
    ModulinoPixels,
    ModulinoDistance,
)

from machine import Pin

pixels = ModulinoPixels()
received_data = ""


def handle_message(input):
    if not input or len(input) == 0:
        return
    vals = input.split(" ")
    print(vals)
    r = int(vals[0])
    g = int(vals[1])
    b = int(vals[2])
    n = int(vals[3])
    s = 0
    if len(vals) > 4:
        s = int(vals[4])

    pixels.clear_all()
    pixels.set_range_rgb(s, n, r, g, b, 100)
    pixels.show()


blink = False
ind = 0
# we create a variable to store any incoming messages.
incoming_message = ""

pixels.set_all_rgb(255, 0, 0, 100)

while False:

    ### Reset things that need resetting

    ### Blink so that we know the sketch is working
    ind = ind + 1
    if ind % 4 == 0:
        blink = not blink
        myLED.value(blink)
        if blink:
            pixels.set_rgb(7, 0, 0, 255, 5)
        pixels.show()

    ### Get any data coming in (not doing this at the moment...)
    incoming_message = non_blocking_read()
    if incoming_message:
        handle_message(incoming_message)

    time.sleep(0.05)
