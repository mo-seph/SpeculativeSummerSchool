import time
import sys
from modulino import ModulinoKnob, ModulinoThermo
from machine import Pin
# import supervisor

myLED = Pin(6, Pin.OUT) #declare pin 25 as an output

state = "undefined"
def set_state(s):
  global state
  if not state == s:
    print(f"state:{s}")
  state = s
  
set_state("labelling")
# or classifying...

knob = ModulinoKnob()


thermo_module = ModulinoThermo()
temperature = 0
humidity = 0

blink = False


def action():
  if state == "classifying":
    print(f"classify:{temperature}")
  else:
    print(f"label:{temperature}")

knob.on_press = action
knob.on_rotate_clockwise = lambda steps, value: set_state("labelling")
knob.on_rotate_counter_clockwise = lambda steps, value: set_state("classifying")

if not thermo_module.connected:
    print("🤷 No thermo modulino found")    
    exit()


# non_blocking_read is a function made to read incoming serial messages more smoothly.
def non_blocking_read():
    i = ""
    #while supervisor.runtime.serial_bytes_available:
        # i += sys.stdin.read(1)
    return i


# we create a variable to store any incoming messages.
incoming_message = ""
ind = 1
while True:
    temperature = thermo_module.temperature
    humidity = thermo_module.relative_humidity
    if( knob.update() ):
      pass
      #print("Update!")
    # print() sends to the output
    # print(f"test:{ind}")
    ind = ind + 1
    if ind % 2 == 0:
      blink = not blink
      myLED.value(blink)
    #incoming_message = non_blocking_read()
    time.sleep(0.1)