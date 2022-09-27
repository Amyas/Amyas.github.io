(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{288:function(a,t,D){"use strict";D.r(t);var s=D(13),n=Object(s.a)({},(function(){var a=this,t=a._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"_6-标志寄存器"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_6-标志寄存器"}},[a._v("#")]),a._v(" 6.标志寄存器")]),a._v(" "),t("img",{attrs:{src:"https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/62022-09-02-14-08-01.png",alt:"62022-09-02-14-08-01",width:"",height:""}}),a._v(" "),t("p",[a._v("查看 DTDEBUG 中的 EFLAGS 的值，然后转换成二进制的形式，并取出 CF/PF/AF/ZF/SF/OF 的值")]),a._v(" "),t("p",[a._v("记住这几个寄存器的位置和名称")]),a._v(" "),t("h2",{attrs:{id:"_1、进位标志-cf-carry-flag-如果运算结果的最高位产生了一个进位或借位-那么-其值为-1-否则其值为-0。"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1、进位标志-cf-carry-flag-如果运算结果的最高位产生了一个进位或借位-那么-其值为-1-否则其值为-0。"}},[a._v("#")]),a._v(" 1、进位标志 CF(Carry Flag):如果运算结果的最高位产生了一个进位或借位，那么，其值为 1，否则其值为 0。")]),a._v(" "),t("p",[a._v("MOV AL,0xEF MOV AL,0xFE\nADD AL,2 ADD AL,2")]),a._v(" "),t("h2",{attrs:{id:"_2、奇偶标志-pf-parity-flag-奇偶标志-pf-用于反映运算结果中-1-的个数的奇偶性。"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2、奇偶标志-pf-parity-flag-奇偶标志-pf-用于反映运算结果中-1-的个数的奇偶性。"}},[a._v("#")]),a._v(" 2、奇偶标志 PF(Parity Flag)：奇偶标志 PF 用于反映运算结果中“1”的个数的奇偶性。")]),a._v(" "),t("p",[a._v("如果“1”的个数为偶数，则 PF 的值为 1，否则其值为 0。")]),a._v(" "),t("p",[a._v("MOV AL,3\nADD AL,3\nADD AL,2")]),a._v(" "),t("h2",{attrs:{id:"_3、辅助进位标志-af-auxiliary-carry-flag"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3、辅助进位标志-af-auxiliary-carry-flag"}},[a._v("#")]),a._v(" 3、辅助进位标志 AF(Auxiliary Carry Flag)：")]),a._v(" "),t("p",[a._v("在发生下列情况时，辅助进位标志 AF 的值被置为 1，否则其值为 0：\n(1)、在字操作时，发生低字节向高字节进位或借位时；\n(2)、在字节操作时，发生低 4 位向高 4 位进位或借位时。\nMOV EAX,0x55EEFFFF MOV AX,5EFE MOV AL,4E\nADD EAX,2 ADD AX,2 ADD AL,2")]),a._v(" "),t("h2",{attrs:{id:"_4、零标志-zf-zero-flag-零标志-zf-用来反映运算结果是否为-0。"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4、零标志-zf-zero-flag-零标志-zf-用来反映运算结果是否为-0。"}},[a._v("#")]),a._v(" 4、零标志 ZF(Zero Flag)：零标志 ZF 用来反映运算结果是否为 0。")]),a._v(" "),t("p",[a._v("如果运算结果为 0，则其值为 1，否则其值为 0。在判断运算结果是否为 0 时，可使用此标志位。")]),a._v(" "),t("p",[a._v("XOR EAX,EAX")]),a._v(" "),t("p",[a._v("MOV EAX,2\nSUB EAX,2")]),a._v(" "),t("h2",{attrs:{id:"_5、符号标志-sf-sign-flag-符号标志-sf-用来反映运算结果的符号位-它与运算结果的最高位相同。"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5、符号标志-sf-sign-flag-符号标志-sf-用来反映运算结果的符号位-它与运算结果的最高位相同。"}},[a._v("#")]),a._v(" 5、符号标志 SF(Sign Flag)：符号标志 SF 用来反映运算结果的符号位，它与运算结果的最高位相同。")]),a._v(" "),t("p",[a._v("MOV AL,7F\nADD AL,2")]),a._v(" "),t("h2",{attrs:{id:"_6、溢出标志-of-overflow-flag-溢出标志-of-用于反映有符号数加减运算所得结果是否溢出。"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_6、溢出标志-of-overflow-flag-溢出标志-of-用于反映有符号数加减运算所得结果是否溢出。"}},[a._v("#")]),a._v(" 6、溢出标志 OF(Overflow Flag)：溢出标志 OF 用于反映有符号数加减运算所得结果是否溢出。")]),a._v(" "),t("p",[a._v("如果运算结果超过当前运算位数所能表示的范围，则称为溢出，OF 的值被置为 1，否则，OF 的值被清为 0。")]),a._v(" "),t("p",[a._v("最高位进位与溢出的区别：")]),a._v(" "),t("p",[a._v("进位标志表示无符号数运算结果是否超出范围.")]),a._v(" "),t("p",[a._v("溢出标志表示有符号数运算结果是否超出范围.")]),a._v(" "),t("p",[a._v("溢出主要是给有符号运算使用的，在有符号的运算中，有如下的规律：")]),a._v(" "),t("p",[a._v("正 + 正 = 正 如果结果是负数，则说明有溢出")]),a._v(" "),t("p",[a._v("负 + 负 = 负 如果结果是正数，则说明有溢出")]),a._v(" "),t("p",[a._v("正 + 负 永远都不会有溢出.")]),a._v(" "),t("img",{attrs:{src:"https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/62022-09-02-14-09-07.png",alt:"62022-09-02-14-09-07",width:"",height:""}}),a._v(" "),t("h2",{attrs:{id:"adc-指令-带进位加法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#adc-指令-带进位加法"}},[a._v("#")]),a._v(" ADC 指令：带进位加法")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",[t("code",[a._v("格式：ADC  R/M,R/M/IMM   两边不能同时为内存  宽度要一样\n\n\nADC AL,CL\n\nADC BYTE PTR DS:[12FFC4],2\n\nADC BYTE PTR DS:[12FFC4],AL\n")])])]),t("h2",{attrs:{id:"sbb-指令-带借位减法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#sbb-指令-带借位减法"}},[a._v("#")]),a._v(" SBB 指令：带借位减法")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",[t("code",[a._v("格式：SBB  R/M,R/M   两边不能同时为内存  宽度要一样\n\n\nSBB AL,CL\n\nSBB BYTE PTR DS:[12FFC4],2\n\nSBB BYTE PTR DS:[12FFC4],AL\n")])])]),t("h2",{attrs:{id:"xchg-指令-交换数据"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#xchg-指令-交换数据"}},[a._v("#")]),a._v(" XCHG 指令：交换数据")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",[t("code",[a._v("格式：XCHG  R/M,R/M/IMM   两边不能同时为内存  宽度要一样\n\n\nXCHG AL,CL\n\nXCHG DWORD PTR DS:[12FFC4],EAX\n\nXCHG BYTE PTR DS:[12FFC4],AL\n")])])]),t("h2",{attrs:{id:"movs-指令-移动数据-内存-内存"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#movs-指令-移动数据-内存-内存"}},[a._v("#")]),a._v(" MOVS 指令：移动数据 内存-内存")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",[t("code",[a._v("BYTE/WORD/DWORD\n\nMOVS BYTE PTR ES:[EDI],BYTE PTR DS:[ESI]\t简写为：MOVSB\n\nMOVS WORD PTR ES:[EDI],BYTE PTR DS:[ESI]\t简写为：MOVSW\n\nMOVS DWORD PTR ES:[EDI],BYTE PTR DS:[ESI]\t 简写为：MOVSD\n\n例子：\n\nMOV EDI,12FFD8\nMOV ESI,12FFD0\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\t观察EDI的值\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\n\n修改标志寄存器中D位的值，然后在执行下面的指令：\n\nMOV EDI,12FFD8\nMOV ESI,12FFD0\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\t观察EDI的值\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\nMOVS DWORD PTR ES:[EDI],DWORD PTR DS:[ESI]\n")])])]),t("h2",{attrs:{id:"stos-指令-讲-al-ax-eax-的值存储到-edi-指定的内存单元"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#stos-指令-讲-al-ax-eax-的值存储到-edi-指定的内存单元"}},[a._v("#")]),a._v(" STOS 指令：讲 Al/AX/EAX 的值存储到[EDI]指定的内存单元")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",[t("code",[a._v("STOS BYTE PTR ES:[EDI]\t简写为STOSB\n\nSTOS WORD PTR ES:[EDI]\t简写为STOSW\n\nSTOS DWORD PTR ES:[EDI]\t 简写为STOSD\n\n\n\nMOV EAX,12345678\nMOV EDI,12FFC4\nSTOS BYTE PTR ES:[EDI]\t观察EDI的值\nSTOS WORD PTR ES:[EDI]\nSTOS DWORD PTR ES:[EDI]\n\n\n修改标志寄存器中D位的值，然后在执行下面的指令：\n\nMOV EAX,12345678\nMOV EDI,12FFC4\nSTOS BYTE PTR ES:[EDI]\t观察EDI的值\nSTOS WORD PTR ES:[EDI]\nSTOS DWORD PTR ES:[EDI]\n")])])]),t("h2",{attrs:{id:"rep-指令-按计数寄存器-ecx-中指定的次数重复执行字符串指令"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#rep-指令-按计数寄存器-ecx-中指定的次数重复执行字符串指令"}},[a._v("#")]),a._v(" REP 指令：按计数寄存器 (ECX) 中指定的次数重复执行字符串指令")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",[t("code",[a._v("MOV ECX,10\n\nREP MOVSD\n\nREP STOSD\n")])])])])}),[],!1,null,null,null);t.default=n.exports}}]);