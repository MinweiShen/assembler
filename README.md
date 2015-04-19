Assembler
=========
This is an simple assembler implemented in Javascript used for CS1400, University of Utah, 2014 Fall.
Supported instructions are:
* store ra, L // Store the value stored in ra into L
* load L, ra // Load the value stored at L into ra
* cmp ra, rb // Compare the values of ra and rb, setting condition codes
* add ra, rb, rc // Add the values of ra and rb, put result in rc
* sub ra, rb, rc // Subtract the values of ra and rb, put result in rc
* and ra, rb, rc // And the values of ra and rb, put result in rc
* nor ra, rb, rc // Nor the values of ra and rb, put result in rc
* halt // Halt the computer
* jump L // Execute the instruction labeled L next
* bgt L // If in the last arithmetic operation or comparison the first operand was greater than the second operand, execute the instruction labeled L next
* bne L // If in the last arithmetic operation or comparison the operands were unequal, execute the instruction labeled L next
* clear ra // Store 0 into ra

Maybe more will be added, based on the need of the course.

You can try it at [My blog](http://mwshen.info/2014/11/14/Assembler-for-CS1400/).
