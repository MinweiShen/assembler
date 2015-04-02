function clean(){
    //console.log("clear");
    $("#assembly").val("");
    $("#machine").val("");
}

function assemble(){
    //console.log("begin assemble");
    var assembleCode = $('#assembly').val();
    var instructions = assembleCode.split("\n");
    var machineCode = [];
    //label:line, variable:line
    var labelLocation = {};
    for(var i=0;i< instructions.length;i++){
        var instruction = instructions[i].split("//")[0];
        if(instruction == "")
            continue;
        if(instruction.split(":").length == 2){
            console.log(instruction);
            var label = instruction.split(":")[0];  // It is possible the label is a variable
            instruction = instruction.split(":")[1].trim();
            labelLocation[label] = i;

            //check if instruction is actually a number.
            if(!isNaN(instruction)){
                var value = parseInt(instruction);
                if(value >= 0)
                   machineCode.push(value)
                else{
                    machineCode.push(256+value);
                }
                continue;
            }
        }

        //1st pass translation. some instructions are translated. some variables and labels are recorded
        var instructionType = instruction.split(" ")[0];
        switch (instructionType){
            case "store":
                //console.log("store");
                machineCode.push(store_instruction(instruction,1,labelLocation));
                break;
            case "load":
                //console.log("load");
                machineCode.push(load_instruction(instruction,1,labelLocation));
                break;
            case "move":
                //console.log("move");
                break;
            case "nop":
                //console.log("nop");
                machineCode.push(161);
                break;
            case "cmp":
                //console.log("cmp");
                var result = cmp_instruction(instruction);
                if(result == 0)
                    alert("Error line " + (i+1));
                else
                    machineCode.push(result);
                break;
            case "add":
                //console.log("add");
                var result = cal_instruction(instruction,"add");
                if(result == 0)
                    alert("Error line " + (i+1));
                else
                    machineCode.push(result);
                break;
            case "sub":
                //console.log("sub");
                var result = cal_instruction(instruction,"sub");
                if(result == 0)
                    alert("Error line " + (i+1));
                else
                    machineCode.push(result);
                break;
            case "and":
                //console.log("and");
                var result = cal_instruction(instruction,"and");
                if(result == 0)
                    alert("Error line " + (i+1));
                else
                    machineCode.push(result);
                break;
            case "or":
                //console.log("or");
                break;
            case "nand":
                //console.log("nand");
                break;
            case "nor":
                //console.log("nor");
                var result = cal_instruction(instruction,"nor");
                if(result == 0)
                    alert("Error line " + (i+1));
                else
                    machineCode.push(result);
                break;
            case "not":
                //console.log("not");
                break;
            case "clear":
                //console.log("clear");
                break;
            case "halt":
                //console.log("halt");
                machineCode.push(161);
                break;
            case "jump":
                //console.log("jump");
                machineCode.push(jump_instruction(instruction,1,labelLocation));
                break;
            case "bgt":
                //console.log("bgt");
                machineCode.push(branch_instruction(instruction,1,labelLocation));
                break;
            case "bne":
                //console.log("bne");
                machineCode.push(branch_instruction(instruction,1,labelLocation));
                break;
            default:
                alert("Error line " + (i+1));
        }

    }

    //2nd pass, translate instructions with variables
    for(var i=0;i<machineCode.length;i++){
        if(typeof(machineCode[i]) == "string"){
            var instruction = machineCode[i];
            var instructionType = instruction.split(" ")[0];
            switch (instructionType){
                case "store":
                    //console.log("store");
                    machineCode[i] = store_instruction(instruction,2,labelLocation);
                    break;
                case "load":
                    //console.log("store");
                    machineCode[i] = load_instruction(instruction,2,labelLocation);
                    break;
                case "jump":
                    //console.log("jump");
                    machineCode[i] = jump_instruction(instruction,2,labelLocation);
                    break;
                case "bgt":
                    //console.log("bgt");
                    var lineno = branch_instruction(instruction,2,labelLocation)
                    if (lineno > i){
                        machineCode[i] = 224+lineno-i;
                    }
                    else{
                        machineCode[i] = 256+lineno-i;
                    }
                    break;
                case "bne":
                    //console.log("bne");
                    var lineno = branch_instruction(instruction,2,labelLocation)
                    if (lineno > i){
                        machineCode[i] = 192+lineno-i;
                    }
                    else{
                        machineCode[i] = 224+lineno-i;
                    }
                    break;
                default:
                    alert("6 Error line " + (i+1));
            }

        }
    }

    // for(var i=0;i<machineCode.length;i++)
    //  console.log(machineCode[i]);

    //convert the codes into hex
    var count = 0;
    var code = "";
    for(var i=0;i<machineCode.length;i++){
        var hex = machineCode[i].toString(16);
        if(hex.length == 1)
            hex = "0" + hex;
        code += hex+ " ";
        count ++;
        if(count == 4){
            count = 0;
            code += "\n";
        }
    }
    $("#machine").val(code);
 }

function store_instruction(instruction, pass,labelLocation){
    if(pass == 1)
        return instruction;
    else{
        var inst = instruction.split(",");
        var a = inst[0].split(" ")[1][1];
        var b = inst[1].trim();
        var result = 0;
        if(a == "1")
            result += 32;

        result += labelLocation[b];
        return result;
    }
}

function load_instruction(instruction,pass,labelLocation){
    if(pass == 1)
        return instruction;
    else{
        var inst = instruction.split(",");
        var a = inst[0].split(" ")[1].trim();
        var b = inst[1].trim()[1];
        var result = 64;
        if(b == "1")
            result += 32;
        result += labelLocation[a];
        return result;
    }
}

function cmp_instruction(instruction){
    var a,b;
    instruction = instruction.trim();
    a = instruction.split(" ")[1][1];
    b = instruction[instruction.length-1];
    if(a == "0" && b == "0")
        return 192;
    else if(a == "0" && b == "1")
        return 193;
    else if(a == "1" && b == "0")
        return 224;
    else if(a == "1" && b == "1")
        return 225;
    else{
        alert("cmp error");
        return 0;
    }

}

function cal_instruction(instruction,type){
    var a,b,c;
    var r = instruction.split(",");
    a = r[0].split(" ")[1][1];
    b = r[1].trim()[1];
    c = r[2].trim()[1];
    var result = 128;
    if(type == "add")
        result += 0;
    else if(type == "sub")
        result += 1;
    else if(type == "and")
        result += 2;
    else if(type == "nor")
        result += 3;
    else
        return 0;

    if(a == "1")
        result += 8;
    if(b == "1")
        result += 4;
    if(c == "1")
        result += 16;

    return result;
}

function jump_instruction(instruction,pass,labelLocation){
    if(pass == 1)
        return instruction;
    else{
        var label = instruction.split(" ")[1];
        var result = 160;
        result += labelLocation[label];
        return result;
    }
}
function branch_instruction(instruction,pass,labelLocation){
    if(pass == 1)
        return instruction;
    else{
        var label = instruction.split(" ")[1];
        return labelLocation[label];
    }
}

















