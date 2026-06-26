# Monster 创建链 PassiveObject .act 标签覆盖路由

状态：需验证

本文件覆盖目标 PVF 中 monster 创建 passiveobject 后，下游 `.act` 观察到的字段、闭合标签和反引号 token。覆盖表示结构已观察并有路由，不表示运行效果已验证。

## 覆盖统计

- 字段标签：610 / 610。
- 闭合标签：91 / 91。
- 反引号 token：8 / 8。
- 未覆盖字段标签：0。
- 未覆盖闭合标签：0。
- 未覆盖反引号 token：0。

## 路由边界

- 下游 `.act` 可能继续创建 passiveobject，必须递归到链路收敛。
- 闭合块、内联直接 ID、随机候选和空 `[INDEX]` 必须分开处理。
- 动作条件、移动、位置、目标选择、伤害和同步语义不能只凭标签名推断。
- 下游 `.ani` 继续走动画路由，下游 `.atk` 继续走 AttackInfo 路由。

## 全量字段标签

`[-]`, `[!=]`, `[%]`, `[+]`, `[<]`, `[<=]`, `[=]`, `[=<]`, `[==]`, `[=>]`。

`[>]`, `[>=]`, `[ACCEL]`, `[ACCEL MOVE]`, `[ACCEL OPTION]`, `[ACCEL REG]`, `[ACCELERATE]`, `[ACTIVE STATUS]`, `[ADD ANIMATION]`, `[ADD ANIMATION EX]`。

`[ADD APPENDAGE]`, `[ADD CHAIN LINE ANI]`, `[ADD RESIST]`, `[AI CHARACTER]`, `[ALL]`, `[ALL CHARACTER TEAM]`, `[ALL DEATH]`, `[all element]`, `[ALL ENEMY]`, `[ALL MONSTER TEAM]`。

`[ALL OUR TEAM]`, `[ALLOW FIXTURE]`, `[ALLOW OUT MAP]`, `[ALPHA]`, `[ANGLE]`, `[ANI PATH]`, `[APPEND DELAY TIME]`, `[APPEND HIT]`, `[APPENDAGE]`, `[AREA]`。

`[ARG VAR]`, `[armor break]`, `[ATTACK]`, `[attack speed]`, `[ATTACK_COMMAND]`, `[ATTACKRECT]`, `[AXIS]`, `[BACKSIDE]`, `[BASE ANI]`, `[BASIC ATTACK]`。

`[BEGIN GRAB]`, `[BEGIN IF]`, `[BEHAVIOR]`, `[bleeding]`, `[blind]`, `[BOTTOM]`, `[BOUNCE FROM THE WALL]`, `[burn]`, `[CALCULATE TYPE]`, `[CAMOUFLAGE]`。

`[CANCEL CASTING]`, `[cast speed]`, `[CASTING]`, `[CASTING EX]`, `[CENTER MSG]`, `[CHAIN LINE APPENDAGE]`, `[CHANGE AI]`, `[CHANGE ATTACKINFO]`, `[CHANGE ATTACKINFO TARGET]`, `[CHANGE FLOATING HEIGHT]`。

`[CHANGE GRAVITY]`, `[CHANGE LAYER]`, `[CHANGE MODULE]`, `[CHANGE MY TARGET]`, `[CHANGE RADIUS]`, `[CHANGE SIGHT]`, `[CHANGE SIZE END]`, `[CHANGE SIZE START]`, `[CHANGE TIME]`, `[CHARACTER]`。

`[CHARACTER ATTACKSUCCESS]`, `[CHARACTER COOLTIME RESET]`, `[CHARACTER ONLY]`, `[CHARACTER TEAM]`, `[CHECK DISTANCE]`, `[CHECK GROW TYPE]`, `[CHECK INDEX EXCLUDE DEAD]`, `[CHECK JOB]`, `[CHECK NEXT]`, `[CHECK PARTY SLOT]`。

`[CHECK PARTYMEMBERS STATE]`, `[CHECK PLAYER NUM]`, `[CHECK RAID SYMBOL]`, `[CHECK SPECIFIC BUFF]`, `[CHECK STUCK]`, `[CHECK SYMBOL]`, `[CHECK TIME]`, `[CHECK ZPOS]`, `[CHECKED NO]`, `[CHECKED OBJECT]`。

`[CHECKUP]`, `[CHECKUP OBJECT]`, `[CLOSE]`, `[COLLISION GROUP]`, `[COLOR]`, `[COLOR CHANGE EFFECT]`, `[COMPARE VAR]`, `[confuse]`, `[COORDINATE]`, `[COUNT]`。

`[COUNTER HIT INFO]`, `[cover]`, `[CREATE COUNT]`, `[CREATE LUISE INJECTION APPEDNDAGE]`, `[CREATE NUM]`, `[CREATE PASSIVEOBJECT]`, `[CREATE PASSIVEOBJECT CIRCLE]`, `[CREATE PUSH DUST]`, `[CREATE STOP DUST]`, `[CREATE TERM]`。

`[CREATE VAR]`, `[curse]`, `[CUSTOM]`, `[DAMAGE]`, `[DAMAGE HP]`, `[DAMAGE1]`, `[dark element]`, `[DARKNESS]`, `[DARKNESS LIGHT]`, `[DASH ATTACK]`。

`[DEBUFF]`, `[DEBUFF GHOST]`, `[DECREASE COOLTIME]`, `[DEFAULT]`, `[DEFAULT ATTACKINFO]`, `[DELAY DO BEHAVIOR]`, `[DELAYED DIE]`, `[DELETE APPENDAGE]`, `[DESTROY]`, `[DESTROY BY FORCE]`。

`[DESTROY LUISE INJECTION APPEDNDAGE]`, `[DESTROY WHEN PARENT DIE]`, `[DIALOG]`, `[DIE]`, `[DIM]`, `[DIRECT DO BEHAVIOR]`, `[DIRECTION]`, `[DIRECTION RELATIVE]`, `[DIRECTION RELATIVE OFFSET]`, `[DISPLAY ME]`。

`[DISPLAY SCREEN]`, `[DISPLAY TARGET]`, `[DISTANCE]`, `[DISTANCE MAX]`, `[DISTANCE MIN]`, `[DISTANCE OFFSET]`, `[DISTANCE Z]`, `[DO BEAVIOR]`, `[DO BEHAVIOR]`, `[DO ME]`。

`[do not pass]`, `[DO PROC BEHAVIOR]`, `[DO TARGET]`, `[DOWN]`, `[DUNGEON INDEX]`, `[DUNGEON NOT INDEX]`, `[DUNGEON SYMBOL CALC]`, `[DUNGEON SYMBOL COMPARE]`, `[DUNGEON SYMBOL SET]`, `[DUNGEON SYMBOL SYNC]`。

`[EACH CREATE POS RANDOM]`, `[EFFECT ALPHA END]`, `[EFFECT ALPHA START]`, `[EFFECT BLUE END]`, `[EFFECT BLUE START]`, `[EFFECT GREEN END]`, `[EFFECT GREEN START]`, `[EFFECT RED END]`, `[EFFECT RED START]`, `[ELLIPSE_RATE]`。

`[ELSE]`, `[ELSE IF]`, `[ENABLE]`, `[END]`, `[END GRAB]`, `[END GRAB PRESET]`, `[END IF]`, `[END SOURCE STATE]`, `[END TIME]`, `[END TIME DO BEHAVIOR]`。

`[ENEMY TEAM]`, `[equipment magical attack]`, `[equipment magical defense]`, `[equipment physical attack]`, `[equipment physical defense]`, `[EVEN ONE DEATH]`, `[EX GAUGE MODE]`, `[EXPERT]`, `[FAIL]`, `[FILTER VAR]`。

`[FIND MOVABLE POS]`, `[FIX DIRECTION]`, `[FIXED STATUS]`, `[FLASH SCREEN]`, `[FLASH SCREEN OFF]`, `[FOCUS CAMERA]`, `[FOG APPENDAGE SET LIGHT]`, `[FOLLOW PARENT DIRECTION]`, `[FOLLOWING TARGET]`, `[FOLLOWING TARGET AND DIRECTION]`。

`[FORCE]`, `[FORCED FALLOW TARGET LEVEL]`, `[FRAME]`, `[FRAME JUST]`, `[FRAME SET]`, `[FRAME STOP]`, `[freeze]`, `[FREQUENCY TIME]`, `[FRONTSIDE]`, `[GAUGE COORD POS]`。

`[GAUGE COORD TYPE]`, `[GET DUNGEON TIME]`, `[GET TARGET]`, `[GET TIME]`, `[good hit]`, `[GRAB OFF]`, `[GRAB OFF PRESET]`, `[GRAB ON]`, `[haste]`, `[HAVE FOLLOWING OBJECT]`。

`[HEIGHT]`, `[HERO]`, `[HIDE HITGAUGE]`, `[HIGH]`, `[hit recovery]`, `[HOLD]`, `[hold]`, `[HOLD TIME]`, `[HOMING CHECK GAP]`, `[HOMING TO CHECKUP OBJECT]`。

`[HOMING VELOCITY]`, `[HP]`, `[hp max]`, `[hp regen rate]`, `[ID]`, `[IF]`, `[IF FAIL]`, `[IF SUCCESS]`, `[IGNORE GHOSTMODE]`, `[IMG]`。

`[INCLUDE DEAD]`, `[INDEX]`, `[INTERPOLATION MOVE TARGET]`, `[IS ATTACK ACTION]`, `[IS BASIC ACTION]`, `[IS DAMAGE ENABLE]`, `[IS DARK DAMAGE]`, `[IS DIRECTION LEFT]`, `[IS DIRECTION RIGHT]`, `[IS DIRECTION TO MOVE]`。

`[IS END MAP]`, `[IS END MAP RANGE]`, `[IS END MAP VERTICALLY]`, `[IS ETC ACTION]`, `[IS FIRE DAMAGE]`, `[IS FRONTPOS]`, `[IS GRABABLE]`, `[IS HITABLE]`, `[IS HOLD]`, `[IS IN AREA]`。

`[IS IN POINT AREA]`, `[IS IN POS]`, `[IS IN REVIVAL STATE]`, `[IS INDEX]`, `[IS LEFT]`, `[IS LIGHT DAMAGE]`, `[IS NONE DAMAGE]`, `[IS NOT ATTACK ACTION]`, `[IS NOT ETC ACTION]`, `[IS NOT IN LUISE INJECTION APPEDNDAGE]`。

`[IS NOT IN REVIVAL STATE]`, `[IS NOT INDEX]`, `[IS NOT TARGET STATE]`, `[IS NOT TARGETACTIVESTATUS]`, `[IS OBJECT TYPE]`, `[IS OURTEAMATTACKED]`, `[IS PASSIVE OBJECT]`, `[IS RIGHT]`, `[IS TARGET STATE]`, `[IS TARGETACTIVESTATUS]`。

`[IS TEAM]`, `[IS VISIBLE]`, `[IS WATER DAMAGE]`, `[JUMP]`, `[JUMP ATTACK]`, `[JUMP OUT]`, `[jump power]`, `[KEEP STATE]`, `[KEY INPUT GAME]`, `[KING]`。

`[LAND INSIDE TRAP]`, `[LANDTYPE APPENDAGE]`, `[LAST ACTIVE ATTACKER]`, `[LAST ACTIVE ATTACKSUCCESS]`, `[LAST ATTACKER]`, `[LAST ATTACKSUCCESS]`, `[LAST ATTACKSUCCESSES]`, `[LAYER]`, `[LAYER LEVEL]`, `[LEFT]`。

`[LENGTH RATE]`, `[LEVEL]`, `[LIFE TIME]`, `[LIFT UP]`, `[light element]`, `[lightning]`, `[LIMIT]`, `[LIMIT TIME]`, `[LOAD TARGET]`, `[LOCK QUEST UNTIL]`。

`[LOOP]`, `[LOW]`, `[MAGIC CIRCLE]`, `[magical attack]`, `[magical defense]`, `[MAP]`, `[MASTER]`, `[MAXTIME]`, `[ME]`, `[MID]`。

`[MIN DISTANCE]`, `[MIND CONTROL APPENDAGE]`, `[MONSTER]`, `[MONSTER TEAM]`, `[MOTION]`, `[MOVABLE POS ONLY]`, `[MOVE ME]`, `[MOVE PARENT]`, `[MOVE PATTERN]`, `[MOVE PATTERN OFF]`。

`[MOVE REDUCE]`, `[move speed]`, `[MOVE TARGET]`, `[MOVE TIME]`, `[MOVE TO]`, `[MOVE TO TARGET]`, `[MOVE TO TARGET ACTION]`, `[MOVE TO TARGET ACTION XY SPEED]`, `[MOVE TYPE]`, `[MOVE UNIFORM]`。

`[MOVING MOTION]`, `[MOVING ON]`, `[MP]`, `[MUCU LIMIT CONTROL]`, `[MY CASTING GAUGE]`, `[MY DIRECTION]`, `[MY OPPOSITE DIRECTION]`, `[NAME]`, `[NAME HIDE OFF]`, `[NEAR]`。

`[NEUTRAL]`, `[NEXT BEHAVIOR]`, `[NO EFFECT]`, `[NORMAL]`, `[NOT ERASE TARGET]`, `[NOT HAVE FOLLOWING OBJECT]`, `[NOT USE DIRECTION]`, `[NOT USE OBJECT DIRECTION]`, `[NOT USE OBJECT ZPOS]`, `[NOT USE ZPOS]`。

`[NOTICE]`, `[NOW]`, `[OBJECT SCALE]`, `[OBJECT SCALE EX]`, `[OFF]`, `[OFFSET]`, `[OFFSET POS]`, `[ON]`, `[ON ATTACKSUCCESS]`, `[ON COUNTER HIT]`。

`[ON DAMAGE]`, `[ON DESTROY ME]`, `[ON DESTROY OBJECT]`, `[ON END ACTION]`, `[ON END ANIMATION]`, `[ON MOVE COLLISION]`, `[ON REBIRTH]`, `[ON SET ACTION]`, `[ON SHAKE INPUT]`, `[ON USE CUBE SKILL]`。

`[ONLY ALIVE STATE]`, `[ONLY FIRST TIME]`, `[OPTION]`, `[PARABOLA]`, `[PARABOLA ACCEL]`, `[PARABOLA MOVE TO TARGET]`, `[PARENT OFFSET]`, `[PARTICLE]`, `[PARTICLE FILENAME]`, `[PARTY TARGET]`。

`[pass all]`, `[pass only float type]`, `[PASSIVE]`, `[PASSIVE INDEX]`, `[PASSIVE OBJECT]`, `[PATTERN]`, `[PAUSE ACTION CHARACTER]`, `[physical absolute defense]`, `[physical attack]`, `[physical defense]`。

`[PLAY ANIMATION]`, `[PLAY SOUND]`, `[PLAY SOUND ID]`, `[PLAYER]`, `[POINT]`, `[poison]`, `[POS]`, `[POSITION TYPE]`, `[POWER]`, `[PROC]`。

`[PULL APPENDAGE]`, `[PULL APPENDAGE EX]`, `[PUSH ASIDE]`, `[PUSH DUST INDEX]`, `[PUSH MOTION]`, `[PUSH MOTION DELAY TIME]`, `[PUSH MOTION TIME]`, `[PUSH TIME]`, `[PUSH VELOCITY]`, `[PUSH VELOCITY Y]`。

`[RADIUS]`, `[RANDOM]`, `[RANDOM CHECK]`, `[RANDOM KEY]`, `[RANDOM SELECT]`, `[RANGE]`, `[REMOVE ACTIVE STATUS]`, `[REMOVE APPENDAGE]`, `[REMOVE FINAL DAMAGE RATE APPENDAGE]`, `[RESET]`。

`[RESIST CHANGE SKIP]`, `[RESTORE]`, `[RETURN XPOS]`, `[RETURN YPOS]`, `[RETURN ZPOS]`, `[REVERSE]`, `[REVERSE DIRECTION]`, `[REVERSE GAUGE]`, `[RGBA]`, `[RHYTHM ACTION]`。

`[RIGHT]`, `[ROSSALL SOUND APPENDAGE ADD VALUE]`, `[ROTATE]`, `[RPM]`, `[SAVE TARGET OBJECT]`, `[SAY SPEECH]`, `[SCALE]`, `[SCALE PERCENT]`, `[SCREEN GAUGE]`, `[SCREEN GAUGE COORD POS]`。

`[SCREEN GAUGE COORD TYPE]`, `[SEND DAMAGE]`, `[SEND DO BEHAVIOR]`, `[SEND MESSAGE]`, `[SEPARTE REVOLUTION]`, `[SET ACTION]`, `[SET COLLISION OBJECT PATH GUIDE]`, `[SET COLOR]`, `[SET CURRENT HIT OBJECT]`, `[SET DAMAGE BOX]`。

`[SET DIRECTION]`, `[SET DIRECTION TO CHECKUP]`, `[SET FRAME]`, `[SET HOLD DOWNANI]`, `[SET HP]`, `[SET MOVE PARENT]`, `[SET OUTLINE]`, `[SET PARTY TARGET]`, `[SET PASSTYPE]`, `[SET POS FORCE]`。

`[SET POSITION CASTING GAUGE]`, `[SET POSITION HP GAUGE]`, `[SET REVOLUTION]`, `[SET ROTATE]`, `[SET SPEED]`, `[SET SPEED MULTIPLE CONTROL]`, `[SET SYMBOL]`, `[SET TEAM]`, `[SET TOP PARENT]`, `[SET USE HOMING]`。

`[SET VISIBLITY]`, `[SET WHOLE DAMAGETYPE]`, `[SET WIDTH]`, `[SET X SPEED]`, `[SET Y SPEED]`, `[SET Z SPEED]`, `[SETSPEED TO TARGET]`, `[SHAKE INPUT]`, `[SHAKING]`, `[SHOW HITGAUGE]`。

`[SIMPLE JUMP TO TARGET]`, `[SIT]`, `[SIZE]`, `[SKILL ATTACK]`, `[SLAYER]`, `[sleep]`, `[slow]`, `[SOUND]`, `[SOUND EX]`, `[SOUND PROBABILITY]`。

`[SPECIFIC VIEWER APPENDAGE]`, `[SPEECH]`, `[SPEECH POS]`, `[SPEED]`, `[STAND]`, `[START ANGLE]`, `[STARTUP CURRENT POSITION]`, `[STATE]`, `[STAY]`, `[STAY TIME]`。

`[stone]`, `[STOP DUNGEON ZOOM IN]`, `[STOP DUNGEON ZOOM OUT]`, `[STRAGHT SEPCIFIED ANGLE]`, `[STRAGHT WARNNING TO TARGET]`, `[STRAIGHT HOMING Y AXIS REVISION]`, `[STRAIGHT MOVE]`, `[stuck]`, `[stun]`, `[SUB ANI]`。

`[SUB ANI FLAG]`, `[SUB ANI WITH XY]`, `[SUB ANI WITH XYZ]`, `[SUCCESS]`, `[SUFFOCATION APPENDAGE]`, `[SUMMON MARK]`, `[SUMMON MASTER]`, `[SUMMON MONSTER]`, `[SUMMON OBJECT]`, `[SUMMON TIME]`。

`[SUPER DAMAGE]`, `[SUPER DOWN]`, `[TAKE IT]`, `[TARGET]`, `[TARGET CASTING]`, `[TARGET CASTING CANCEL]`, `[TARGET EXTEND CIRCLE]`, `[TARGET OFFSET]`, `[TEAM]`, `[TELEPORT]`。

`[TERROR APPENDAGE]`, `[THICKNESS]`, `[THROW ITS OWN]`, `[THROWING SPEED]`, `[TIME]`, `[TIME VALUE]`, `[TO TARGET]`, `[TRACE MOVING SOURCE]`, `[TRACE MOVING TARGET]`, `[TRAP APPENDAGE]`。

`[TRIGGER]`, `[TRIGGER CHECK]`, `[TRIGGER QUESTEVENT]`, `[TYPE]`, `[UNBEATABLE]`, `[UNIFORM]`, `[UP]`, `[UPDATE VAR]`, `[USE ANGLE]`, `[USE EFFECT]`。

`[USE FIRST POS]`, `[USE MAP POS]`, `[USE ME X POSITION]`, `[USE MY BASEPOS]`, `[USE MY DIRECTION]`, `[USE MY DIRECTION BASE]`, `[USE MY POS]`, `[USE MY TEAM]`, `[USE NEXT ACTION]`, `[USE OBJECT ZPOS]`。

`[USE TARGET]`, `[USE TARGET POS]`, `[USE TARGET TEAM]`, `[USE ZPOS OFFSET]`, `[USE ZPOS ZERO]`, `[VALIDTIME]`, `[VELOCITY]`, `[WARNING MARK]`, `[WHICH]`, `[WIND APPENDAGE]`。

`[X AXIS]`, `[X END]`, `[X START]`, `[Y AXIS]`, `[Y AXIS RATE]`, `[Y END]`, `[Y SCALE]`, `[Y START]`, `[Z]`, `[Z AXIS]`。

`[Z END]`, `[Z OFFSET]`, `[Z START]`, `[ZOOM IN AFTER MOVE]`, `[ZOOM IT]`, `[ZOOM IT PLUS]`, `[ZOOM OUT BEFORE MOVE]`, `[ZOOM RATE]`, `[ZOOM TIME]`, `[ZPOS]`。

## 全量闭合标签

`[/ADD ANIMATION EX]`, `[/ADD APPENDAGE]`, `[/ADD CHAIN LINE ANI]`, `[/APPENDAGE]`, `[/ARG VAR]`, `[/BAHAVIOR]`, `[/BEGIN GRAB]`, `[/BEHAVIOR]`, `[/CASTING]`, `[/CASTING EX]`。

`[/CHAIN LINE APPENDAGE]`, `[/CHECK PLAYER NUM]`, `[/CHECKUP]`, `[/COLOR CHANGE EFFECT]`, `[/COUNTER HIT INFO]`, `[/CREATE PASSIVEOBJECT]`, `[/CREATE PASSIVEOBJECT CIRCLE]`, `[/CREATE VAR]`, `[/DELETE APPENDAGE]`, `[/DIM]`。

`[/DUNGEON INDEX]`, `[/DUNGEON NOT INDEX]`, `[/END GRAB]`, `[/END GRAB PRESET]`, `[/EX GAUGE MODE]`, `[/FLASH SCREEN]`, `[/FOG APPENDAGE SET LIGHT]`, `[/FRAME]`, `[/FRAME SET]`, `[/GRAB OFF]`。

`[/GRAB OFF PRESET]`, `[/GRAB ON]`, `[/HOMING TO CHECKUP OBJECT]`, `[/IF]`, `[/INDEX]`, `[/INTERPOLATION MOVE TARGET]`, `[/IS IN AREA]`, `[/IS IN POINT AREA]`, `[/IS INDEX]`, `[/IS NOT INDEX]`。

`[/IS NOT TARGET STATE]`, `[/IS NOT TARGETACTIVESTATUS]`, `[/IS OBJECT TYPE]`, `[/IS TARGETACTIVESTATUS]`, `[/IS TEAM]`, `[/KEY INPUT GAME]`, `[/MOTION]`, `[/MOVE MAP]`, `[/MOVE PATTERN]`, `[/NOTICE]`。

`[/OPTION]`, `[/PARABOLA MOVE TO TARGET]`, `[/PARTY TARGET]`, `[/PLAY ANIMATION]`, `[/PULL APPENDAGE]`, `[/PULL APPENDAGE EX]`, `[/RANDOM]`, `[/RANDOM SELECT]`, `[/REMOVE APPENDAGE]`, `[/RHYTHM ACTION]`。

`[/SET POS FORCE]`, `[/SET REVOLUTION]`, `[/SET SPEED]`, `[/SET SPEED MULTIPLE CONTROL]`, `[/SHOW HITGAUGE]`, `[/SIMPLE JUMP TO TARGET]`, `[/SOUND]`, `[/SOUND EX]`, `[/SOUND PROBABILITY]`, `[/SPECIFIC VIEWER APPENDAGE]`。

`[/SPEECH]`, `[/SPEECH POS]`, `[/STRAGHT SEPCIFIED ANGLE]`, `[/STRAGHT WARNNING TO TARGET]`, `[/STRAIGHT MOVE]`, `[/SUB ANI]`, `[/SUB ANI WITH XY]`, `[/SUB ANI WITH XYZ]`, `[/SUFFOCATION APPENDAGE]`, `[/SUMMON MONSETER]`。

`[/SUMMON MONSTER]`, `[/SUPER DAMAGE]`, `[/SUPER DOWN]`, `[/TARGET CASTING]`, `[/TARGET EXTEND CIRCLE]`, `[/TEAM]`, `[/TELEPORT]`, `[/TRIGGER]`, `[/UNBEATABLE]`, `[/UPDATE VAR]`。

`[/ZOOM IT PLUS]`。

## 全量反引号 token

`[ABSOLUTE]`, `[bottom]`, `[close]`, `[DUNGEON]`, `[middleback]`, `[normal]`, `[REPEAT]`, `[stun]`。

## 字段统计表

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[-]` | 2 | 9 | 5 |
| `[!=]` | 1 | 5 | 5 |
| `[%]` | 2 | 915 | 655 |
| `[+]` | 2 | 1438 | 945 |
| `[<]` | 2 | 1676 | 1054 |
| `[<=]` | 2 | 4900 | 2468 |
| `[=]` | 2 | 2295 | 1280 |
| `[=<]` | 2 | 84 | 64 |
| `[==]` | 1 | 4 | 4 |
| `[=>]` | 2 | 493 | 356 |
| `[>]` | 2 | 788 | 526 |
| `[>=]` | 2 | 1939 | 804 |
| `[ACCEL]` | 1 | 49 | 46 |
| `[ACCEL MOVE]` | 1 | 2 | 2 |
| `[ACCEL OPTION]` | 1 | 2 | 2 |
| `[ACCEL REG]` | 1 | 3 | 3 |
| `[ACCELERATE]` | 2 | 8 | 8 |
| `[ACTIVE STATUS]` | 2 | 172 | 142 |
| `[ADD ANIMATION]` | 1 | 112 | 40 |
| `[ADD ANIMATION EX]` | 1 | 194 | 127 |
| `[ADD APPENDAGE]` | 1 | 3 | 3 |
| `[ADD CHAIN LINE ANI]` | 1 | 2 | 2 |
| `[ADD RESIST]` | 1 | 4 | 4 |
| `[AI CHARACTER]` | 2 | 9 | 9 |
| `[ALL]` | 1 | 1 | 1 |
| `[ALL CHARACTER TEAM]` | 2 | 305 | 145 |
| `[ALL DEATH]` | 2 | 5 | 5 |
| `[all element]` | 1 | 2 | 2 |
| `[ALL ENEMY]` | 2 | 55 | 45 |
| `[ALL MONSTER TEAM]` | 2 | 65 | 34 |
| `[ALL OUR TEAM]` | 1 | 1 | 1 |
| `[ALLOW FIXTURE]` | 1 | 3 | 3 |
| `[ALLOW OUT MAP]` | 1 | 3 | 3 |
| `[ALPHA]` | 1 | 1 | 1 |
| `[ANGLE]` | 1 | 1 | 1 |
| `[ANI PATH]` | 1 | 220 | 152 |
| `[APPEND DELAY TIME]` | 2 | 2 | 2 |
| `[APPEND HIT]` | 2 | 28 | 22 |
| `[APPENDAGE]` | 2 | 100 | 91 |
| `[AREA]` | 2 | 16 | 16 |
| `[ARG VAR]` | 1 | 30 | 3 |
| `[armor break]` | 1 | 4 | 1 |
| `[ATTACK]` | 2 | 297 | 181 |
| `[attack speed]` | 2 | 25 | 16 |
| `[ATTACK_COMMAND]` | 2 | 14 | 14 |
| `[ATTACKRECT]` | 2 | 1066 | 893 |
| `[AXIS]` | 2 | 8 | 8 |
| `[BACKSIDE]` | 2 | 8 | 8 |
| `[BASE ANI]` | 2 | 11919 | 11919 |
| `[BASIC ATTACK]` | 1 | 5 | 5 |
| `[BEGIN GRAB]` | 1 | 10 | 10 |
| `[BEGIN IF]` | 1 | 41 | 40 |
| `[BEHAVIOR]` | 2 | 26129 | 10078 |
| `[bleeding]` | 2 | 3 | 3 |
| `[blind]` | 2 | 5 | 5 |
| `[BOTTOM]` | 1 | 3 | 3 |
| `[BOUNCE FROM THE WALL]` | 2 | 4 | 2 |
| `[burn]` | 2 | 9 | 9 |
| `[CALCULATE TYPE]` | 1 | 2 | 2 |
| `[CAMOUFLAGE]` | 2 | 4 | 4 |
| `[CANCEL CASTING]` | 1 | 4 | 4 |
| `[cast speed]` | 2 | 10 | 9 |
| `[CASTING]` | 2 | 54 | 44 |
| `[CASTING EX]` | 2 | 33 | 33 |
| `[CENTER MSG]` | 1 | 33 | 29 |
| `[CHAIN LINE APPENDAGE]` | 1 | 6 | 6 |
| `[CHANGE AI]` | 2 | 38 | 8 |
| `[CHANGE ATTACKINFO]` | 2 | 92 | 89 |
| `[CHANGE ATTACKINFO TARGET]` | 1 | 4 | 4 |
| `[CHANGE FLOATING HEIGHT]` | 2 | 6 | 6 |
| `[CHANGE GRAVITY]` | 2 | 9 | 9 |
| `[CHANGE LAYER]` | 1 | 34 | 33 |
| `[CHANGE MODULE]` | 2 | 11 | 11 |
| `[CHANGE MY TARGET]` | 1 | 2 | 2 |
| `[CHANGE RADIUS]` | 1 | 6 | 6 |
| `[CHANGE SIGHT]` | 1 | 1 | 1 |
| `[CHANGE SIZE END]` | 2 | 10 | 6 |
| `[CHANGE SIZE START]` | 2 | 10 | 6 |
| `[CHANGE TIME]` | 2 | 14 | 10 |
| `[CHARACTER]` | 2 | 1438 | 835 |
| `[CHARACTER ATTACKSUCCESS]` | 1 | 66 | 60 |
| `[CHARACTER COOLTIME RESET]` | 1 | 2 | 2 |
| `[CHARACTER ONLY]` | 1 | 36 | 32 |
| `[CHARACTER TEAM]` | 1 | 1 | 1 |
| `[CHECK DISTANCE]` | 2 | 12 | 9 |
| `[CHECK GROW TYPE]` | 1 | 1 | 1 |
| `[CHECK INDEX EXCLUDE DEAD]` | 1 | 9 | 5 |
| `[CHECK JOB]` | 1 | 1 | 1 |
| `[CHECK NEXT]` | 1 | 104 | 57 |
| `[CHECK PARTY SLOT]` | 2 | 2 | 2 |
| `[CHECK PARTYMEMBERS STATE]` | 2 | 10 | 5 |
| `[CHECK PLAYER NUM]` | 2 | 36 | 9 |
| `[CHECK RAID SYMBOL]` | 1 | 4 | 4 |
| `[CHECK SPECIFIC BUFF]` | 2 | 8 | 8 |
| `[CHECK STUCK]` | 1 | 4 | 4 |
| `[CHECK SYMBOL]` | 1 | 41 | 16 |
| `[CHECK TIME]` | 2 | 2094 | 1148 |
| `[CHECK ZPOS]` | 1 | 3 | 3 |
| `[CHECKED NO]` | 2 | 4502 | 2030 |
| `[CHECKED OBJECT]` | 1 | 1 | 1 |
| `[CHECKUP]` | 2 | 8177 | 3854 |
| `[CHECKUP OBJECT]` | 2 | 4279 | 2590 |
| `[CLOSE]` | 1 | 8 | 5 |
| `[COLLISION GROUP]` | 2 | 4 | 4 |
| `[COLOR]` | 1 | 5 | 5 |
| `[COLOR CHANGE EFFECT]` | 2 | 14 | 10 |
| `[COMPARE VAR]` | 1 | 4 | 4 |
| `[confuse]` | 2 | 15 | 15 |
| `[COORDINATE]` | 1 | 143 | 34 |
| `[COUNT]` | 2 | 55 | 28 |
| `[COUNTER HIT INFO]` | 1 | 3 | 3 |
| `[cover]` | 1 | 1 | 1 |
| `[CREATE COUNT]` | 1 | 49 | 12 |
| `[CREATE LUISE INJECTION APPEDNDAGE]` | 1 | 1 | 1 |
| `[CREATE NUM]` | 1 | 30 | 2 |
| `[CREATE PASSIVEOBJECT]` | 2 | 7972 | 3058 |
| `[CREATE PASSIVEOBJECT CIRCLE]` | 1 | 49 | 12 |
| `[CREATE PUSH DUST]` | 1 | 15 | 15 |
| `[CREATE STOP DUST]` | 1 | 15 | 15 |
| `[CREATE TERM]` | 1 | 1 | 1 |
| `[CREATE VAR]` | 1 | 2 | 2 |
| `[curse]` | 2 | 9 | 9 |
| `[CUSTOM]` | 2 | 5398 | 3824 |
| `[DAMAGE]` | 2 | 2 | 2 |
| `[DAMAGE HP]` | 2 | 8 | 8 |
| `[DAMAGE1]` | 1 | 7 | 7 |
| `[dark element]` | 2 | 6 | 2 |
| `[DARKNESS]` | 1 | 6 | 2 |
| `[DARKNESS LIGHT]` | 1 | 4 | 2 |
| `[DASH ATTACK]` | 1 | 5 | 5 |
| `[DEBUFF]` | 1 | 1 | 1 |
| `[DEBUFF GHOST]` | 1 | 1 | 1 |
| `[DECREASE COOLTIME]` | 1 | 1 | 1 |
| `[DEFAULT]` | 2 | 54 | 46 |
| `[DEFAULT ATTACKINFO]` | 2 | 70 | 70 |
| `[DELAY DO BEHAVIOR]` | 2 | 380 | 166 |
| `[DELAYED DIE]` | 1 | 8 | 8 |
| `[DELETE APPENDAGE]` | 2 | 39 | 37 |
| `[DESTROY]` | 2 | 5806 | 5411 |
| `[DESTROY BY FORCE]` | 1 | 1 | 1 |
| `[DESTROY LUISE INJECTION APPEDNDAGE]` | 1 | 1 | 1 |
| `[DESTROY WHEN PARENT DIE]` | 1 | 80 | 43 |
| `[DIALOG]` | 1 | 1 | 1 |
| `[DIE]` | 1 | 1 | 1 |
| `[DIM]` | 2 | 1607 | 953 |
| `[DIRECT DO BEHAVIOR]` | 2 | 71 | 66 |
| `[DIRECTION]` | 1 | 152 | 105 |
| `[DIRECTION RELATIVE]` | 1 | 1 | 1 |
| `[DIRECTION RELATIVE OFFSET]` | 1 | 2 | 2 |
| `[DISPLAY ME]` | 1 | 12 | 12 |
| `[DISPLAY SCREEN]` | 1 | 6 | 6 |
| `[DISPLAY TARGET]` | 2 | 9 | 9 |
| `[DISTANCE]` | 2 | 2918 | 1479 |
| `[DISTANCE MAX]` | 1 | 3 | 3 |
| `[DISTANCE MIN]` | 1 | 3 | 3 |
| `[DISTANCE OFFSET]` | 1 | 18 | 18 |
| `[DISTANCE Z]` | 1 | 2 | 2 |
| `[DO BEAVIOR]` | 1 | 1 | 1 |
| `[DO BEHAVIOR]` | 2 | 28889 | 10053 |
| `[DO ME]` | 2 | 19 | 19 |
| `[do not pass]` | 2 | 18 | 18 |
| `[DO PROC BEHAVIOR]` | 1 | 6 | 2 |
| `[DO TARGET]` | 1 | 5 | 5 |
| `[DOWN]` | 2 | 67 | 52 |
| `[DUNGEON INDEX]` | 1 | 16 | 13 |
| `[DUNGEON NOT INDEX]` | 1 | 11 | 11 |
| `[DUNGEON SYMBOL CALC]` | 1 | 10 | 10 |
| `[DUNGEON SYMBOL COMPARE]` | 1 | 220 | 86 |
| `[DUNGEON SYMBOL SET]` | 1 | 164 | 55 |
| `[DUNGEON SYMBOL SYNC]` | 1 | 107 | 30 |
| `[EACH CREATE POS RANDOM]` | 1 | 18 | 9 |
| `[EFFECT ALPHA END]` | 2 | 14 | 10 |
| `[EFFECT ALPHA START]` | 2 | 2 | 2 |
| `[EFFECT BLUE END]` | 2 | 8 | 4 |
| `[EFFECT BLUE START]` | 2 | 10 | 6 |
| `[EFFECT GREEN END]` | 2 | 8 | 4 |
| `[EFFECT GREEN START]` | 2 | 8 | 4 |
| `[EFFECT RED END]` | 2 | 12 | 8 |
| `[EFFECT RED START]` | 2 | 8 | 4 |
| `[ELLIPSE_RATE]` | 1 | 22 | 15 |
| `[ELSE]` | 1 | 1 | 1 |
| `[ELSE IF]` | 1 | 44 | 37 |
| `[ENABLE]` | 2 | 2412 | 1171 |
| `[END]` | 2 | 66 | 60 |
| `[END GRAB]` | 1 | 5 | 5 |
| `[END GRAB PRESET]` | 1 | 3 | 3 |
| `[END IF]` | 1 | 44 | 43 |
| `[END SOURCE STATE]` | 1 | 2 | 1 |
| `[END TIME]` | 1 | 3 | 3 |
| `[END TIME DO BEHAVIOR]` | 1 | 3 | 3 |
| `[ENEMY TEAM]` | 1 | 3 | 3 |
| `[equipment magical attack]` | 1 | 2 | 2 |
| `[equipment magical defense]` | 2 | 20 | 19 |
| `[equipment physical attack]` | 1 | 2 | 2 |
| `[equipment physical defense]` | 2 | 33 | 24 |
| `[EVEN ONE DEATH]` | 2 | 5 | 5 |
| `[EX GAUGE MODE]` | 1 | 10 | 10 |
| `[EXPERT]` | 2 | 6 | 4 |
| `[FAIL]` | 1 | 1 | 1 |
| `[FILTER VAR]` | 1 | 4 | 4 |
| `[FIND MOVABLE POS]` | 1 | 22 | 19 |
| `[FIX DIRECTION]` | 2 | 728 | 227 |
| `[FIXED STATUS]` | 1 | 2 | 2 |
| `[FLASH SCREEN]` | 2 | 205 | 153 |
| `[FLASH SCREEN OFF]` | 1 | 4 | 4 |
| `[FOCUS CAMERA]` | 1 | 9 | 9 |
| `[FOG APPENDAGE SET LIGHT]` | 1 | 3 | 3 |
| `[FOLLOW PARENT DIRECTION]` | 1 | 5 | 3 |
| `[FOLLOWING TARGET]` | 2 | 522 | 384 |
| `[FOLLOWING TARGET AND DIRECTION]` | 2 | 3 | 3 |
| `[FORCE]` | 2 | 41 | 40 |
| `[FORCED FALLOW TARGET LEVEL]` | 1 | 1 | 1 |
| `[FRAME]` | 2 | 17161 | 7878 |
| `[FRAME JUST]` | 1 | 92 | 77 |
| `[FRAME SET]` | 1 | 48 | 31 |
| `[FRAME STOP]` | 1 | 4 | 4 |
| `[freeze]` | 1 | 12 | 12 |
| `[FREQUENCY TIME]` | 2 | 2 | 2 |
| `[FRONTSIDE]` | 2 | 14 | 10 |
| `[GAUGE COORD POS]` | 1 | 10 | 10 |
| `[GAUGE COORD TYPE]` | 1 | 10 | 10 |
| `[GET DUNGEON TIME]` | 1 | 44 | 15 |
| `[GET TARGET]` | 2 | 251 | 183 |
| `[GET TIME]` | 2 | 2374 | 807 |
| `[good hit]` | 1 | 1 | 1 |
| `[GRAB OFF]` | 1 | 16 | 15 |
| `[GRAB OFF PRESET]` | 1 | 4 | 4 |
| `[GRAB ON]` | 1 | 20 | 20 |
| `[haste]` | 1 | 1 | 1 |
| `[HAVE FOLLOWING OBJECT]` | 1 | 27 | 18 |
| `[HEIGHT]` | 1 | 3 | 3 |
| `[HERO]` | 2 | 2 | 2 |
| `[HIDE HITGAUGE]` | 2 | 2 | 2 |
| `[HIGH]` | 1 | 11 | 11 |
| `[hit recovery]` | 2 | 4 | 2 |
| `[HOLD]` | 2 | 107 | 100 |
| `[hold]` | 2 | 12 | 12 |
| `[HOLD TIME]` | 1 | 2 | 2 |
| `[HOMING CHECK GAP]` | 1 | 1 | 1 |
| `[HOMING TO CHECKUP OBJECT]` | 1 | 1 | 1 |
| `[HOMING VELOCITY]` | 1 | 1 | 1 |
| `[HP]` | 2 | 831 | 663 |
| `[hp max]` | 2 | 4 | 2 |
| `[hp regen rate]` | 2 | 8 | 8 |
| `[ID]` | 1 | 25 | 14 |
| `[IF]` | 2 | 1585 | 943 |
| `[IF FAIL]` | 2 | 10 | 10 |
| `[IF SUCCESS]` | 2 | 10 | 10 |
| `[IGNORE GHOSTMODE]` | 1 | 31 | 13 |
| `[IMG]` | 1 | 12 | 12 |
| `[INCLUDE DEAD]` | 2 | 190 | 48 |
| `[INDEX]` | 2 | 8932 | 3317 |
| `[INTERPOLATION MOVE TARGET]` | 1 | 81 | 76 |
| `[IS ATTACK ACTION]` | 1 | 7 | 6 |
| `[IS BASIC ACTION]` | 1 | 1 | 1 |
| `[IS DAMAGE ENABLE]` | 1 | 1 | 1 |
| `[IS DARK DAMAGE]` | 1 | 13 | 13 |
| `[IS DIRECTION LEFT]` | 1 | 44 | 42 |
| `[IS DIRECTION RIGHT]` | 1 | 37 | 35 |
| `[IS DIRECTION TO MOVE]` | 2 | 10 | 10 |
| `[IS END MAP]` | 2 | 82 | 75 |
| `[IS END MAP RANGE]` | 1 | 21 | 21 |
| `[IS END MAP VERTICALLY]` | 2 | 2 | 2 |
| `[IS ETC ACTION]` | 1 | 3 | 3 |
| `[IS FIRE DAMAGE]` | 2 | 34 | 34 |
| `[IS FRONTPOS]` | 1 | 2 | 2 |
| `[IS GRABABLE]` | 1 | 18 | 15 |
| `[IS HITABLE]` | 1 | 1 | 1 |
| `[IS HOLD]` | 1 | 2 | 2 |
| `[IS IN AREA]` | 1 | 145 | 35 |
| `[IS IN POINT AREA]` | 1 | 1 | 1 |
| `[IS IN POS]` | 2 | 1080 | 60 |
| `[IS IN REVIVAL STATE]` | 1 | 5 | 5 |
| `[IS INDEX]` | 2 | 4838 | 2427 |
| `[IS LEFT]` | 2 | 31 | 31 |
| `[IS LIGHT DAMAGE]` | 1 | 13 | 13 |
| `[IS NONE DAMAGE]` | 1 | 12 | 12 |
| `[IS NOT ATTACK ACTION]` | 1 | 8 | 8 |
| `[IS NOT ETC ACTION]` | 1 | 4 | 2 |
| `[IS NOT IN LUISE INJECTION APPEDNDAGE]` | 1 | 1 | 1 |
| `[IS NOT IN REVIVAL STATE]` | 1 | 8 | 5 |
| `[IS NOT INDEX]` | 2 | 12 | 10 |
| `[IS NOT TARGET STATE]` | 2 | 119 | 26 |
| `[IS NOT TARGETACTIVESTATUS]` | 1 | 1 | 1 |
| `[IS OBJECT TYPE]` | 2 | 361 | 228 |
| `[IS OURTEAMATTACKED]` | 2 | 2 | 2 |
| `[IS PASSIVE OBJECT]` | 1 | 6 | 6 |
| `[IS RIGHT]` | 2 | 29 | 29 |
| `[IS TARGET STATE]` | 2 | 105 | 98 |
| `[IS TARGETACTIVESTATUS]` | 2 | 21 | 18 |
| `[IS TEAM]` | 2 | 12 | 6 |
| `[IS VISIBLE]` | 2 | 5 | 5 |
| `[IS WATER DAMAGE]` | 2 | 15 | 15 |
| `[JUMP]` | 2 | 10 | 10 |
| `[JUMP ATTACK]` | 1 | 5 | 5 |
| `[JUMP OUT]` | 2 | 39 | 18 |
| `[jump power]` | 2 | 5 | 5 |
| `[KEEP STATE]` | 1 | 13 | 11 |
| `[KEY INPUT GAME]` | 1 | 1 | 1 |
| `[KING]` | 2 | 6 | 4 |
| `[LAND INSIDE TRAP]` | 1 | 2 | 2 |
| `[LANDTYPE APPENDAGE]` | 2 | 12 | 12 |
| `[LAST ACTIVE ATTACKER]` | 2 | 4 | 4 |
| `[LAST ACTIVE ATTACKSUCCESS]` | 2 | 15 | 11 |
| `[LAST ATTACKER]` | 2 | 65 | 20 |
| `[LAST ATTACKSUCCESS]` | 2 | 465 | 330 |
| `[LAST ATTACKSUCCESSES]` | 2 | 72 | 60 |
| `[LAYER]` | 1 | 261 | 172 |
| `[LAYER LEVEL]` | 1 | 2 | 2 |
| `[LEFT]` | 2 | 253 | 184 |
| `[LENGTH RATE]` | 1 | 26 | 26 |
| `[LEVEL]` | 2 | 8291 | 3256 |
| `[LIFE TIME]` | 2 | 14 | 10 |
| `[LIFT UP]` | 1 | 9 | 6 |
| `[light element]` | 1 | 1 | 1 |
| `[lightning]` | 2 | 5 | 4 |
| `[LIMIT]` | 2 | 2238 | 1353 |
| `[LIMIT TIME]` | 1 | 2 | 2 |
| `[LOAD TARGET]` | 2 | 160 | 32 |
| `[LOCK QUEST UNTIL]` | 2 | 11 | 11 |
| `[LOOP]` | 1 | 4 | 4 |
| `[LOW]` | 2 | 170 | 122 |
| `[MAGIC CIRCLE]` | 2 | 20 | 15 |
| `[magical attack]` | 2 | 20 | 13 |
| `[magical defense]` | 1 | 4 | 4 |
| `[MAP]` | 1 | 6 | 2 |
| `[MASTER]` | 2 | 6 | 4 |
| `[MAXTIME]` | 1 | 10 | 10 |
| `[ME]` | 2 | 25936 | 9783 |
| `[MID]` | 1 | 5 | 3 |
| `[MIN DISTANCE]` | 2 | 68 | 55 |
| `[MIND CONTROL APPENDAGE]` | 2 | 3 | 3 |
| `[MONSTER]` | 2 | 1988 | 1303 |
| `[MONSTER TEAM]` | 2 | 8 | 2 |
| `[MOTION]` | 2 | 11919 | 11919 |
| `[MOVABLE POS ONLY]` | 1 | 43 | 17 |
| `[MOVE ME]` | 2 | 229 | 174 |
| `[MOVE PARENT]` | 1 | 78 | 45 |
| `[MOVE PATTERN]` | 2 | 90 | 90 |
| `[MOVE PATTERN OFF]` | 2 | 16 | 16 |
| `[MOVE REDUCE]` | 2 | 5 | 5 |
| `[move speed]` | 2 | 89 | 66 |
| `[MOVE TARGET]` | 2 | 58 | 50 |
| `[MOVE TIME]` | 1 | 2 | 2 |
| `[MOVE TO]` | 1 | 1 | 1 |
| `[MOVE TO TARGET]` | 1 | 26 | 26 |
| `[MOVE TO TARGET ACTION]` | 1 | 16 | 15 |
| `[MOVE TO TARGET ACTION XY SPEED]` | 1 | 8 | 8 |
| `[MOVE TYPE]` | 1 | 81 | 76 |
| `[MOVE UNIFORM]` | 2 | 2 | 2 |
| `[MOVING MOTION]` | 2 | 8 | 8 |
| `[MOVING ON]` | 1 | 3 | 3 |
| `[MP]` | 2 | 15 | 15 |
| `[MUCU LIMIT CONTROL]` | 2 | 31 | 31 |
| `[MY CASTING GAUGE]` | 1 | 10 | 10 |
| `[MY DIRECTION]` | 2 | 145 | 104 |
| `[MY OPPOSITE DIRECTION]` | 1 | 9 | 9 |
| `[NAME]` | 1 | 12 | 12 |
| `[NAME HIDE OFF]` | 1 | 2 | 2 |
| `[NEAR]` | 1 | 5 | 5 |
| `[NEUTRAL]` | 2 | 4 | 4 |
| `[NEXT BEHAVIOR]` | 1 | 9 | 9 |
| `[NO EFFECT]` | 2 | 1458 | 664 |
| `[NORMAL]` | 2 | 35 | 29 |
| `[NOT ERASE TARGET]` | 1 | 3 | 3 |
| `[NOT HAVE FOLLOWING OBJECT]` | 1 | 29 | 25 |
| `[NOT USE DIRECTION]` | 1 | 1 | 1 |
| `[NOT USE OBJECT DIRECTION]` | 1 | 9 | 9 |
| `[NOT USE OBJECT ZPOS]` | 1 | 5 | 4 |
| `[NOT USE ZPOS]` | 1 | 4 | 4 |
| `[NOTICE]` | 1 | 11 | 9 |
| `[NOW]` | 2 | 4794 | 3964 |
| `[OBJECT SCALE]` | 1 | 2 | 2 |
| `[OBJECT SCALE EX]` | 1 | 60 | 32 |
| `[OFF]` | 2 | 4837 | 1448 |
| `[OFFSET]` | 1 | 130 | 90 |
| `[OFFSET POS]` | 2 | 68 | 55 |
| `[ON]` | 2 | 3401 | 1295 |
| `[ON ATTACKSUCCESS]` | 2 | 860 | 784 |
| `[ON COUNTER HIT]` | 1 | 3 | 3 |
| `[ON DAMAGE]` | 2 | 445 | 314 |
| `[ON DESTROY ME]` | 2 | 10 | 10 |
| `[ON DESTROY OBJECT]` | 2 | 8 | 8 |
| `[ON END ACTION]` | 1 | 81 | 78 |
| `[ON END ANIMATION]` | 1 | 14 | 14 |
| `[ON MOVE COLLISION]` | 2 | 11 | 11 |
| `[ON REBIRTH]` | 1 | 3 | 3 |
| `[ON SET ACTION]` | 2 | 1773 | 1580 |
| `[ON SHAKE INPUT]` | 1 | 1 | 1 |
| `[ON USE CUBE SKILL]` | 1 | 1 | 1 |
| `[ONLY ALIVE STATE]` | 1 | 1 | 1 |
| `[ONLY FIRST TIME]` | 1 | 3 | 3 |
| `[OPTION]` | 1 | 5 | 5 |
| `[PARABOLA]` | 1 | 12 | 12 |
| `[PARABOLA ACCEL]` | 1 | 1 | 1 |
| `[PARABOLA MOVE TO TARGET]` | 1 | 3 | 3 |
| `[PARENT OFFSET]` | 1 | 10 | 10 |
| `[PARTICLE]` | 2 | 786 | 444 |
| `[PARTICLE FILENAME]` | 2 | 7972 | 3058 |
| `[PARTY TARGET]` | 2 | 613 | 279 |
| `[pass all]` | 1 | 5 | 5 |
| `[pass only float type]` | 1 | 5 | 5 |
| `[PASSIVE]` | 2 | 2888 | 1320 |
| `[PASSIVE INDEX]` | 1 | 1 | 1 |
| `[PASSIVE OBJECT]` | 2 | 44 | 28 |
| `[PATTERN]` | 2 | 80 | 10 |
| `[PAUSE ACTION CHARACTER]` | 1 | 2 | 2 |
| `[physical absolute defense]` | 1 | 1 | 1 |
| `[physical attack]` | 2 | 20 | 13 |
| `[physical defense]` | 2 | 10 | 8 |
| `[PLAY ANIMATION]` | 1 | 10 | 6 |
| `[PLAY SOUND]` | 1 | 179 | 141 |
| `[PLAY SOUND ID]` | 1 | 3 | 2 |
| `[PLAYER]` | 2 | 383 | 274 |
| `[POINT]` | 2 | 195 | 158 |
| `[poison]` | 2 | 27 | 26 |
| `[POS]` | 2 | 9032 | 3621 |
| `[POSITION TYPE]` | 1 | 1 | 1 |
| `[POWER]` | 1 | 3 | 3 |
| `[PROC]` | 1 | 3 | 3 |
| `[PULL APPENDAGE]` | 2 | 98 | 79 |
| `[PULL APPENDAGE EX]` | 2 | 54 | 43 |
| `[PUSH ASIDE]` | 1 | 9 | 6 |
| `[PUSH DUST INDEX]` | 1 | 15 | 15 |
| `[PUSH MOTION]` | 1 | 15 | 15 |
| `[PUSH MOTION DELAY TIME]` | 1 | 15 | 15 |
| `[PUSH MOTION TIME]` | 1 | 15 | 15 |
| `[PUSH TIME]` | 1 | 15 | 15 |
| `[PUSH VELOCITY]` | 1 | 15 | 15 |
| `[PUSH VELOCITY Y]` | 1 | 14 | 14 |
| `[RADIUS]` | 1 | 43 | 33 |
| `[RANDOM]` | 2 | 2886 | 635 |
| `[RANDOM CHECK]` | 2 | 6 | 6 |
| `[RANDOM KEY]` | 1 | 1 | 1 |
| `[RANDOM SELECT]` | 2 | 719 | 396 |
| `[RANGE]` | 1 | 145 | 35 |
| `[REMOVE ACTIVE STATUS]` | 1 | 9 | 9 |
| `[REMOVE APPENDAGE]` | 2 | 6 | 4 |
| `[REMOVE FINAL DAMAGE RATE APPENDAGE]` | 1 | 1 | 1 |
| `[RESET]` | 2 | 1236 | 975 |
| `[RESIST CHANGE SKIP]` | 1 | 1 | 1 |
| `[RESTORE]` | 2 | 553 | 505 |
| `[RETURN XPOS]` | 2 | 8 | 8 |
| `[RETURN YPOS]` | 2 | 8 | 8 |
| `[RETURN ZPOS]` | 2 | 8 | 8 |
| `[REVERSE]` | 2 | 42 | 39 |
| `[REVERSE DIRECTION]` | 1 | 24 | 22 |
| `[REVERSE GAUGE]` | 1 | 5 | 5 |
| `[RGBA]` | 1 | 36 | 20 |
| `[RHYTHM ACTION]` | 2 | 10 | 10 |
| `[RIGHT]` | 2 | 761 | 333 |
| `[ROSSALL SOUND APPENDAGE ADD VALUE]` | 1 | 1 | 1 |
| `[ROTATE]` | 1 | 32 | 31 |
| `[RPM]` | 1 | 43 | 33 |
| `[SAVE TARGET OBJECT]` | 2 | 56 | 47 |
| `[SAY SPEECH]` | 2 | 116 | 98 |
| `[SCALE]` | 1 | 51 | 30 |
| `[SCALE PERCENT]` | 1 | 103 | 73 |
| `[SCREEN GAUGE]` | 1 | 5 | 5 |
| `[SCREEN GAUGE COORD POS]` | 1 | 1 | 1 |
| `[SCREEN GAUGE COORD TYPE]` | 1 | 1 | 1 |
| `[SEND DAMAGE]` | 1 | 6 | 5 |
| `[SEND DO BEHAVIOR]` | 2 | 30 | 30 |
| `[SEND MESSAGE]` | 2 | 14 | 14 |
| `[SEPARTE REVOLUTION]` | 1 | 3 | 3 |
| `[SET ACTION]` | 2 | 4910 | 4054 |
| `[SET COLLISION OBJECT PATH GUIDE]` | 1 | 1 | 1 |
| `[SET COLOR]` | 2 | 4 | 4 |
| `[SET CURRENT HIT OBJECT]` | 1 | 6 | 5 |
| `[SET DAMAGE BOX]` | 2 | 158 | 113 |
| `[SET DIRECTION]` | 2 | 412 | 365 |
| `[SET DIRECTION TO CHECKUP]` | 1 | 6 | 6 |
| `[SET FRAME]` | 2 | 240 | 197 |
| `[SET HOLD DOWNANI]` | 2 | 6 | 6 |
| `[SET HP]` | 1 | 21 | 18 |
| `[SET MOVE PARENT]` | 1 | 9 | 9 |
| `[SET OUTLINE]` | 2 | 4 | 2 |
| `[SET PARTY TARGET]` | 2 | 2 | 2 |
| `[SET PASSTYPE]` | 2 | 28 | 24 |
| `[SET POS FORCE]` | 2 | 132 | 90 |
| `[SET POSITION CASTING GAUGE]` | 1 | 21 | 17 |
| `[SET POSITION HP GAUGE]` | 1 | 22 | 22 |
| `[SET REVOLUTION]` | 1 | 43 | 33 |
| `[SET ROTATE]` | 1 | 1 | 1 |
| `[SET SPEED]` | 2 | 1945 | 1104 |
| `[SET SPEED MULTIPLE CONTROL]` | 1 | 1 | 1 |
| `[SET SYMBOL]` | 1 | 18 | 13 |
| `[SET TEAM]` | 2 | 40 | 34 |
| `[SET TOP PARENT]` | 1 | 208 | 30 |
| `[SET USE HOMING]` | 2 | 177 | 141 |
| `[SET VISIBLITY]` | 2 | 22 | 13 |
| `[SET WHOLE DAMAGETYPE]` | 1 | 5 | 5 |
| `[SET WIDTH]` | 2 | 6 | 6 |
| `[SET X SPEED]` | 1 | 28 | 14 |
| `[SET Y SPEED]` | 1 | 5 | 3 |
| `[SET Z SPEED]` | 1 | 22 | 12 |
| `[SETSPEED TO TARGET]` | 1 | 43 | 11 |
| `[SHAKE INPUT]` | 2 | 5 | 5 |
| `[SHAKING]` | 2 | 689 | 620 |
| `[SHOW HITGAUGE]` | 2 | 27 | 27 |
| `[SIMPLE JUMP TO TARGET]` | 1 | 3 | 3 |
| `[SIT]` | 1 | 8 | 8 |
| `[SIZE]` | 1 | 3 | 3 |
| `[SKILL ATTACK]` | 1 | 5 | 5 |
| `[SLAYER]` | 1 | 4 | 2 |
| `[sleep]` | 2 | 5 | 5 |
| `[slow]` | 2 | 31 | 31 |
| `[SOUND]` | 2 | 2801 | 2799 |
| `[SOUND EX]` | 1 | 56 | 56 |
| `[SOUND PROBABILITY]` | 2 | 2 | 2 |
| `[SPECIFIC VIEWER APPENDAGE]` | 1 | 1 | 1 |
| `[SPEECH]` | 2 | 54 | 54 |
| `[SPEECH POS]` | 1 | 1 | 1 |
| `[SPEED]` | 2 | 72 | 59 |
| `[STAND]` | 2 | 119 | 110 |
| `[START ANGLE]` | 1 | 21 | 14 |
| `[STARTUP CURRENT POSITION]` | 1 | 1 | 1 |
| `[STATE]` | 1 | 28 | 25 |
| `[STAY]` | 2 | 2 | 2 |
| `[STAY TIME]` | 2 | 20 | 20 |
| `[stone]` | 1 | 3 | 3 |
| `[STOP DUNGEON ZOOM IN]` | 1 | 2 | 2 |
| `[STOP DUNGEON ZOOM OUT]` | 1 | 2 | 2 |
| `[STRAGHT SEPCIFIED ANGLE]` | 1 | 1 | 1 |
| `[STRAGHT WARNNING TO TARGET]` | 1 | 18 | 18 |
| `[STRAIGHT HOMING Y AXIS REVISION]` | 1 | 1 | 1 |
| `[STRAIGHT MOVE]` | 2 | 8 | 8 |
| `[stuck]` | 2 | 10 | 10 |
| `[stun]` | 2 | 35 | 30 |
| `[SUB ANI]` | 2 | 5869 | 5868 |
| `[SUB ANI FLAG]` | 1 | 64 | 15 |
| `[SUB ANI WITH XY]` | 1 | 6 | 6 |
| `[SUB ANI WITH XYZ]` | 2 | 27 | 27 |
| `[SUCCESS]` | 1 | 1 | 1 |
| `[SUFFOCATION APPENDAGE]` | 2 | 6 | 2 |
| `[SUMMON MARK]` | 1 | 68 | 48 |
| `[SUMMON MASTER]` | 2 | 389 | 310 |
| `[SUMMON MONSTER]` | 2 | 314 | 259 |
| `[SUMMON OBJECT]` | 1 | 22 | 22 |
| `[SUMMON TIME]` | 2 | 26 | 23 |
| `[SUPER DAMAGE]` | 1 | 15 | 15 |
| `[SUPER DOWN]` | 1 | 9 | 6 |
| `[TAKE IT]` | 2 | 2 | 2 |
| `[TARGET]` | 2 | 38 | 32 |
| `[TARGET CASTING]` | 1 | 10 | 10 |
| `[TARGET CASTING CANCEL]` | 1 | 9 | 6 |
| `[TARGET EXTEND CIRCLE]` | 1 | 3 | 3 |
| `[TARGET OFFSET]` | 1 | 10 | 10 |
| `[TEAM]` | 2 | 218 | 167 |
| `[TELEPORT]` | 2 | 257 | 200 |
| `[TERROR APPENDAGE]` | 2 | 4 | 4 |
| `[THICKNESS]` | 1 | 3 | 3 |
| `[THROW ITS OWN]` | 2 | 2 | 2 |
| `[THROWING SPEED]` | 1 | 28 | 25 |
| `[TIME]` | 2 | 94 | 91 |
| `[TIME VALUE]` | 1 | 36 | 20 |
| `[TO TARGET]` | 2 | 38 | 35 |
| `[TRACE MOVING SOURCE]` | 1 | 1 | 1 |
| `[TRACE MOVING TARGET]` | 1 | 1 | 1 |
| `[TRAP APPENDAGE]` | 2 | 2 | 2 |
| `[TRIGGER]` | 2 | 32129 | 10081 |
| `[TRIGGER CHECK]` | 2 | 969 | 170 |
| `[TRIGGER QUESTEVENT]` | 2 | 13 | 13 |
| `[TYPE]` | 2 | 93 | 93 |
| `[UNBEATABLE]` | 1 | 5 | 5 |
| `[UNIFORM]` | 1 | 23 | 23 |
| `[UP]` | 2 | 38 | 25 |
| `[UPDATE VAR]` | 1 | 4 | 2 |
| `[USE ANGLE]` | 1 | 1 | 1 |
| `[USE EFFECT]` | 2 | 9 | 9 |
| `[USE FIRST POS]` | 1 | 17 | 10 |
| `[USE MAP POS]` | 2 | 1290 | 376 |
| `[USE ME X POSITION]` | 1 | 13 | 12 |
| `[USE MY BASEPOS]` | 2 | 512 | 317 |
| `[USE MY DIRECTION]` | 2 | 2109 | 602 |
| `[USE MY DIRECTION BASE]` | 1 | 71 | 67 |
| `[USE MY POS]` | 1 | 8 | 8 |
| `[USE MY TEAM]` | 1 | 6 | 5 |
| `[USE NEXT ACTION]` | 1 | 10 | 10 |
| `[USE OBJECT ZPOS]` | 2 | 1041 | 551 |
| `[USE TARGET]` | 2 | 68 | 55 |
| `[USE TARGET POS]` | 2 | 7 | 7 |
| `[USE TARGET TEAM]` | 2 | 36 | 32 |
| `[USE ZPOS OFFSET]` | 1 | 14 | 13 |
| `[USE ZPOS ZERO]` | 1 | 29 | 27 |
| `[VALIDTIME]` | 2 | 68 | 55 |
| `[VELOCITY]` | 2 | 90 | 90 |
| `[WARNING MARK]` | 2 | 405 | 86 |
| `[WHICH]` | 2 | 9524 | 4376 |
| `[WIND APPENDAGE]` | 1 | 6 | 3 |
| `[X AXIS]` | 2 | 1370 | 824 |
| `[X END]` | 2 | 8 | 5 |
| `[X START]` | 2 | 130 | 88 |
| `[Y AXIS]` | 2 | 648 | 333 |
| `[Y AXIS RATE]` | 1 | 18 | 9 |
| `[Y END]` | 1 | 6 | 3 |
| `[Y SCALE]` | 1 | 26 | 26 |
| `[Y START]` | 2 | 130 | 88 |
| `[Z]` | 2 | 8 | 8 |
| `[Z AXIS]` | 2 | 987 | 591 |
| `[Z END]` | 1 | 7 | 4 |
| `[Z OFFSET]` | 1 | 30 | 30 |
| `[Z START]` | 2 | 132 | 90 |
| `[ZOOM IN AFTER MOVE]` | 1 | 2 | 2 |
| `[ZOOM IT]` | 2 | 4 | 4 |
| `[ZOOM IT PLUS]` | 1 | 2 | 2 |
| `[ZOOM OUT BEFORE MOVE]` | 1 | 2 | 2 |
| `[ZOOM RATE]` | 1 | 2 | 2 |
| `[ZOOM TIME]` | 1 | 2 | 2 |
| `[ZPOS]` | 2 | 1325 | 1020 |

## 闭合标签统计表

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[/ADD ANIMATION EX]` | 1 | 193 | 126 |
| `[/ADD APPENDAGE]` | 1 | 3 | 3 |
| `[/ADD CHAIN LINE ANI]` | 1 | 2 | 2 |
| `[/APPENDAGE]` | 2 | 100 | 91 |
| `[/ARG VAR]` | 1 | 30 | 3 |
| `[/BAHAVIOR]` | 1 | 1 | 1 |
| `[/BEGIN GRAB]` | 1 | 10 | 10 |
| `[/BEHAVIOR]` | 2 | 26120 | 10074 |
| `[/CASTING]` | 1 | 11 | 7 |
| `[/CASTING EX]` | 2 | 33 | 33 |
| `[/CHAIN LINE APPENDAGE]` | 1 | 6 | 6 |
| `[/CHECK PLAYER NUM]` | 2 | 36 | 9 |
| `[/CHECKUP]` | 2 | 8162 | 3846 |
| `[/COLOR CHANGE EFFECT]` | 2 | 14 | 10 |
| `[/COUNTER HIT INFO]` | 1 | 3 | 3 |
| `[/CREATE PASSIVEOBJECT]` | 2 | 7972 | 3058 |
| `[/CREATE PASSIVEOBJECT CIRCLE]` | 1 | 49 | 12 |
| `[/CREATE VAR]` | 1 | 2 | 2 |
| `[/DELETE APPENDAGE]` | 2 | 39 | 37 |
| `[/DIM]` | 2 | 1607 | 953 |
| `[/DUNGEON INDEX]` | 1 | 16 | 13 |
| `[/DUNGEON NOT INDEX]` | 1 | 11 | 11 |
| `[/END GRAB]` | 1 | 5 | 5 |
| `[/END GRAB PRESET]` | 1 | 3 | 3 |
| `[/EX GAUGE MODE]` | 1 | 10 | 10 |
| `[/FLASH SCREEN]` | 1 | 36 | 20 |
| `[/FOG APPENDAGE SET LIGHT]` | 1 | 3 | 3 |
| `[/FRAME]` | 1 | 3 | 3 |
| `[/FRAME SET]` | 1 | 48 | 31 |
| `[/GRAB OFF]` | 1 | 16 | 15 |
| `[/GRAB OFF PRESET]` | 1 | 4 | 4 |
| `[/GRAB ON]` | 1 | 20 | 20 |
| `[/HOMING TO CHECKUP OBJECT]` | 1 | 1 | 1 |
| `[/IF]` | 2 | 1585 | 943 |
| `[/INDEX]` | 2 | 17 | 11 |
| `[/INTERPOLATION MOVE TARGET]` | 1 | 81 | 76 |
| `[/IS IN AREA]` | 1 | 145 | 35 |
| `[/IS IN POINT AREA]` | 1 | 1 | 1 |
| `[/IS INDEX]` | 2 | 4820 | 2415 |
| `[/IS NOT INDEX]` | 1 | 8 | 8 |
| `[/IS NOT TARGET STATE]` | 1 | 6 | 3 |
| `[/IS NOT TARGETACTIVESTATUS]` | 1 | 1 | 1 |
| `[/IS OBJECT TYPE]` | 2 | 354 | 221 |
| `[/IS TARGETACTIVESTATUS]` | 1 | 5 | 5 |
| `[/IS TEAM]` | 1 | 1 | 1 |
| `[/KEY INPUT GAME]` | 1 | 1 | 1 |
| `[/MOTION]` | 2 | 11921 | 11918 |
| `[/MOVE MAP]` | 1 | 1 | 1 |
| `[/MOVE PATTERN]` | 2 | 90 | 90 |
| `[/NOTICE]` | 1 | 11 | 9 |
| `[/OPTION]` | 1 | 5 | 5 |
| `[/PARABOLA MOVE TO TARGET]` | 1 | 3 | 3 |
| `[/PARTY TARGET]` | 2 | 605 | 277 |
| `[/PLAY ANIMATION]` | 1 | 10 | 6 |
| `[/PULL APPENDAGE]` | 1 | 14 | 12 |
| `[/PULL APPENDAGE EX]` | 2 | 54 | 43 |
| `[/RANDOM]` | 2 | 4 | 2 |
| `[/RANDOM SELECT]` | 2 | 720 | 396 |
| `[/REMOVE APPENDAGE]` | 1 | 1 | 1 |
| `[/RHYTHM ACTION]` | 2 | 10 | 10 |
| `[/SET POS FORCE]` | 2 | 132 | 90 |
| `[/SET REVOLUTION]` | 1 | 43 | 33 |
| `[/SET SPEED]` | 2 | 1936 | 1098 |
| `[/SET SPEED MULTIPLE CONTROL]` | 1 | 1 | 1 |
| `[/SHOW HITGAUGE]` | 2 | 27 | 27 |
| `[/SIMPLE JUMP TO TARGET]` | 1 | 3 | 3 |
| `[/SOUND]` | 2 | 2801 | 2799 |
| `[/SOUND EX]` | 1 | 56 | 56 |
| `[/SOUND PROBABILITY]` | 2 | 2 | 2 |
| `[/SPECIFIC VIEWER APPENDAGE]` | 1 | 1 | 1 |
| `[/SPEECH]` | 2 | 54 | 54 |
| `[/SPEECH POS]` | 1 | 1 | 1 |
| `[/STRAGHT SEPCIFIED ANGLE]` | 1 | 1 | 1 |
| `[/STRAGHT WARNNING TO TARGET]` | 1 | 18 | 18 |
| `[/STRAIGHT MOVE]` | 2 | 8 | 8 |
| `[/SUB ANI]` | 2 | 5862 | 5862 |
| `[/SUB ANI WITH XY]` | 1 | 6 | 6 |
| `[/SUB ANI WITH XYZ]` | 2 | 27 | 27 |
| `[/SUFFOCATION APPENDAGE]` | 2 | 2 | 2 |
| `[/SUMMON MONSETER]` | 2 | 4 | 4 |
| `[/SUMMON MONSTER]` | 2 | 309 | 254 |
| `[/SUPER DAMAGE]` | 1 | 15 | 15 |
| `[/SUPER DOWN]` | 1 | 9 | 6 |
| `[/TARGET CASTING]` | 1 | 10 | 10 |
| `[/TARGET EXTEND CIRCLE]` | 1 | 3 | 3 |
| `[/TEAM]` | 2 | 11 | 5 |
| `[/TELEPORT]` | 2 | 257 | 200 |
| `[/TRIGGER]` | 2 | 27326 | 10079 |
| `[/UNBEATABLE]` | 1 | 5 | 5 |
| `[/UPDATE VAR]` | 1 | 2 | 2 |
| `[/ZOOM IT PLUS]` | 1 | 2 | 2 |

## Token 统计表

| Token | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[ABSOLUTE]` | 1 | 6 | 6 |
| `[bottom]` | 1 | 27 | 27 |
| `[close]` | 1 | 12 | 12 |
| `[DUNGEON]` | 1 | 5 | 5 |
| `[middleback]` | 1 | 1 | 1 |
| `[normal]` | 1 | 28 | 24 |
| `[REPEAT]` | 1 | 1 | 1 |
| `[stun]` | 1 | 5 | 5 |
