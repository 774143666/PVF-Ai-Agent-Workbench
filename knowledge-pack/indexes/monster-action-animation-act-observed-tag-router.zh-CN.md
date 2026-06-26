# Monster .act 标签覆盖路由

状态：需验证

本文件覆盖目标 PVF 中 monster 动作链相关 `.act` 观察到的字段标签、闭合标签和 `.act` 内反引号 token。覆盖表示“已观察到并有路由”，不表示运行效果已经验证。

## 覆盖统计

- 字段标签：877 / 877。
- 闭合标签：117 / 117。
- 反引号 token：8 / 8。
- 未覆盖字段标签：0。
- 未覆盖闭合标签：0。
- 未覆盖反引号 token：0。

## 主要路由

- 动作与动画：优先核 `[MOTION]`、`[BASE ANI]`、`[SUB ANI]`、`[FRAME]`、`[SET ACTION]`。
- 条件与行为：优先核 `[TRIGGER]`、`[BEHAVIOR]`、`[DO BEHAVIOR]`、`[CHECKUP]`、`[WHICH]`。
- 创建对象：遇到 `[CREATE PASSIVEOBJECT]` 必须通过正确 registry 解析对象 ID。
- 坐标与移动：`[POS]`、`[X AXIS]`、`[DISTANCE]`、`[MOVE]` 类标签需结合帧和目标状态。
- 声音与表现：`[SOUND]`、`[SPEECH]`、`[PARTICLE FILENAME]` 只证明 PVF 引用，不证明客户端资源存在。

## 全量字段标签

`[-]`, `[!=]`, `[%]`, `[+]`, `[<]`, `[<=]`, `[=]`, `[=<]`, `[==]`, `[=>]`。

`[>]`, `[>=]`, `[ABS CASTING]`, `[ABSOLUTE]`, `[ACCEL]`, `[ACCEL MOVE]`, `[ACCEL OPTION]`, `[ACTION INDICES]`, `[ACTIVE STATUS]`, `[ACTIVE SYSTEM]`。

`[ADD ANI TO OBJECT]`, `[ADD ANIMATION]`, `[ADD ANIMATION EX]`, `[ADD APPENDAGE]`, `[ADD CATEGORY]`, `[ADD LAYER]`, `[ADD RESIST]`, `[AGAMEMNON TELEKINESIS]`, `[AI CHARACTER]`, `[ALL]`。

`[all]`, `[all active status resistance]`, `[ALL ALIVE]`, `[ALL CHARACTER TEAM]`, `[all element]`, `[ALL ENEMY]`, `[ALL MONSTER TEAM]`, `[ALL OUR TEAM]`, `[ALLOW FIXTURE]`, `[ALLOW OUT MAP]`。

`[ALWAYS STRAIGHT HOMING]`, `[ANGER]`, `[ANGER APPENDAGE]`, `[ANI FILE]`, `[ANI PATH]`, `[APPEND DELAY TIME]`, `[APPEND HIT]`, `[APPENDAGE]`, `[APPENDAGE TIME]`, `[AREA]`。

`[ARG VAR]`, `[armor break]`, `[ATTACK]`, `[attack direction]`, `[attack enemy]`, `[attack speed]`, `[attack type]`, `[ATTACK_COMMAND]`, `[ATTACKABLEAREA APPENDAGE]`, `[ATTACKRECT]`。

`[AUTOEND]`, `[AXIS INDEX]`, `[BACK ATTACK]`, `[BACKSIDE]`, `[BASE ANI]`, `[BEGIN IF]`, `[BEHAVIOR]`, `[BEHAVIOR WHEN ARRIVE]`, `[bleeding]`, `[bless]`。

`[blind]`, `[BLOSSOM APPENDAGE]`, `[BLOSSOM APPENDAGE ADD STACK]`, `[BLOSSOM APPENDAGE CHANGE STATUS]`, `[BLOSSOM DANDELION APPENDAGE BURST]`, `[BLOSSOM_APPENDAGE]`, `[blow]`, `[burn]`, `[CAMOUFLAGE]`, `[CAN ANOHTER BEHAVIOR]`。

`[CANCEL CASTING]`, `[cast speed]`, `[CASTING]`, `[CASTING EX]`, `[CENTER MSG]`, `[CHAIN LINE APPENDAGE]`, `[CHANGE]`, `[CHANGE ACTION FILE]`, `[CHANGE AI]`, `[CHANGE ATTACKINFO]`。

`[CHANGE ATTACKINFO TARGET]`, `[CHANGE BASE ANIMATION]`, `[CHANGE DIRECTION BY TARGET]`, `[CHANGE DISGUISER]`, `[CHANGE FLOATING HEIGHT]`, `[CHANGE GRAVITY]`, `[CHANGE MAP]`, `[CHANGE MODULE]`, `[CHANGE MY TARGET]`, `[CHANGE NAME]`。

`[CHANGE RADIUS]`, `[CHANGE RIDABLESKILL PATTERN]`, `[CHANGE SIGHT]`, `[CHANGE SIZE END]`, `[CHANGE SIZE START]`, `[CHANGE STATE SKIP]`, `[CHANGE STATUS DAMAGE REDUCE]`, `[CHANGE STATUS TO OTHERSIDE OF MAP CHANGE SYSTEM]`, `[CHANGE TEAM]`, `[CHANGE TIME]`。

`[CHARACTER]`, `[CHARACTER ATTACKSUCCESS]`, `[CHARACTER COOLTIME RESET]`, `[CHARACTER ONLY]`, `[CHARACTER TEAM]`, `[CHARACTERISTIC]`, `[CHARCTER TEAM]`, `[CHARGED TIME]`, `[CHECK AREA]`, `[CHECK BUFF]`。

`[CHECK DISTANCE]`, `[CHECK GHOST]`, `[CHECK NEXT]`, `[CHECK OBJECT]`, `[CHECK PARTY SYMBOL]`, `[CHECK PARTYMEMBERS STATE]`, `[CHECK PLAYER NUM]`, `[CHECK RAID SYMBOL]`, `[CHECK SPECIFIC BUFF]`, `[CHECK SPECIFIC BUFF NOT]`。

`[CHECK STUCK]`, `[CHECK SYMBOL]`, `[CHECK TIME]`, `[CHECKED NO]`, `[CHECKED OBJECT]`, `[CHECKTIME]`, `[CHECKUP]`, `[CHECKUP OBJECT]`, `[CINEMATIC]`, `[CLEAR ANI]`。

`[CLOSE]`, `[close]`, `[COLLISION GROUP]`, `[COLOR]`, `[COLOR CHANGE EFFECT]`, `[COMPARE VAR]`, `[confuse]`, `[COOL TIME]`, `[COORDINATE]`, `[COUNT]`。

`[COUNTER HIT INFO]`, `[cover]`, `[CREATE COUNT]`, `[CREATE FREQUENCE]`, `[CREATE NUM]`, `[CREATE OBJECT]`, `[CREATE PASSIVEOBJECT]`, `[CREATE PASSIVEOBJECT CIRCLE]`, `[CREATE PUSH DUST]`, `[CREATE STOP DUST]`。

`[CREATE TERM]`, `[curse]`, `[CURSE APPENDAGE]`, `[CUSTOM]`, `[CUSTOM ID UI ALL CLEAR]`, `[CUSTOM ID UI CREATE]`, `[CUSTOM ID UI DELETE]`, `[CUT SCENE]`, `[DAMAGE]`, `[DAMAGE APPENDAGE]`。

`[DAMAGE MOTION]`, `[damage reaction]`, `[DAMAGE TRANSFER APPENDAGE]`, `[DAMAGE1]`, `[dark element]`, `[dark element attack]`, `[DARKNESS]`, `[DARKNESS LIGHT]`, `[DARKSCALP]`, `[DASH]`。

`[DASHATTACK]`, `[DEBUFF]`, `[DEBUFF GHOST]`, `[DEFAULT]`, `[DEFAULT ATTACKINFO]`, `[DEFAULT SIGHT]`, `[DEFAULT TEAM]`, `[DELAY DO BEHAVIOR]`, `[DELETE APPENDAGE]`, `[DEPENDENT ACTION]`。

`[DESOLATEPAIN APPENDAGE]`, `[DESTINATION]`, `[DESTROY]`, `[DESTROY BY FORCE]`, `[DESTROY OBJECT]`, `[DESTROY WHEN PARENT DIE]`, `[DIALOG]`, `[DIE]`, `[DIE_COMMAND]`, `[DIFF ROTATION]`。

`[DIM]`, `[DIRECT DO BEHAVIOR]`, `[DIRECTION]`, `[DIRECTION RELATIVE]`, `[DISPLAY ME]`, `[DISPLAY ONLY SCREEN]`, `[DISPLAY SCREEN]`, `[DISPLAY SCREEN ONLY]`, `[DISPLAY TARGET]`, `[DISTANCE]`。

`[DISTANCE MAX]`, `[DISTANCE MIN]`, `[DO BEHAVIOR]`, `[DO ME]`, `[DO PROC BEHAVIOR]`, `[DONT OVERLAP]`, `[DOWN]`, `[dragon]`, `[DRAW UI LAYER ANIMATION]`, `[DRIECTION]`。

`[DUNGEON]`, `[DUNGEON INDEX]`, `[DUNGEON NOT INDEX]`, `[DUNGEON SYMBOL CALC]`, `[DUNGEON SYMBOL COMPARE]`, `[DUNGEON SYMBOL RANDOM SET]`, `[DUNGEON SYMBOL SET]`, `[DUNGEON SYMBOL SYNC]`, `[DURATION]`, `[DURATION TIME]`。

`[EACH CREATE POS RANDOM]`, `[EASY]`, `[EFFECT ALPHA END]`, `[EFFECT ALPHA START]`, `[EFFECT BLUE END]`, `[EFFECT BLUE START]`, `[EFFECT GREEN END]`, `[EFFECT GREEN START]`, `[EFFECT RED END]`, `[EFFECT RED START]`。

`[element]`, `[elemental property]`, `[ELLIPSE_RATE]`, `[ELSE]`, `[ELSE IF]`, `[ENABLE]`, `[ENABLE OFF]`, `[END]`, `[END ANI]`, `[END EFFECT LEVEL]`。

`[END FRAME]`, `[END IF]`, `[END KEYSTROKE MODE]`, `[END RGBA]`, `[END SOURCE STATE]`, `[ENEMY TEAM]`, `[equipment magical attack]`, `[equipment magical defense]`, `[equipment magicel defense]`, `[equipment physical attack]`。

`[equipment physical defense]`, `[ETC IGNORE COLLISION]`, `[ETC IGNORE MOVE AI]`, `[ETC_COMMAND]`, `[EVEN ONE DEATH]`, `[EX GAUGE MODE]`, `[EXCHANGE HP RATE]`, `[EXPERT]`, `[FACE TO FACE]`, `[FAR]`。

`[FILTER VAR]`, `[FINAL DAMAGE RATE APPENDAGE]`, `[FIND MOVABLE POS]`, `[fire element]`, `[fire element attack]`, `[FIX DIRECTION]`, `[FIX TARGET ME]`, `[FIXTURE]`, `[fixture]`, `[FLASH SCREEN]`。

`[FLASH SCREEN EX]`, `[FLASH SCREEN OFF]`, `[FLIP TYPE]`, `[FOCUS]`, `[FOLLOW PARENT DIRECTION]`, `[FOLLOWING TARGET]`, `[FOLLOWING TARGET FLIP]`, `[FORCE]`, `[FORCE HIT STUN TIME]`, `[FORCED FALLOW TARGET LEVEL]`。

`[FRAME]`, `[FRAME JUST]`, `[FRAME SET]`, `[freeze]`, `[FREQUENCY TIME]`, `[FRONT]`, `[FRONTSIDE]`, `[GAUGE COORD POS]`, `[GAUGE COORD TYPE]`, `[GENERATE AREA]`。

`[GET DUNGEON TIME]`, `[GET OUT]`, `[GET TARGET]`, `[GET TIME]`, `[good hit]`, `[GRAB]`, `[GRAB OFF]`, `[GRAB ON]`, `[GRAPHIC EFFECT]`, `[GUARD APPENDAGE]`。

`[haste]`, `[HAVE FOLLOWING OBJECT]`, `[HEIGHT]`, `[HELLOFHEAL APPENDAGE]`, `[HERO]`, `[HIGH]`, `[HIT DELAY]`, `[hit down]`, `[HIT EFFECT]`, `[hit info]`。

`[hit recovery]`, `[HIT TYPE]`, `[hit wav]`, `[HOLD]`, `[hold]`, `[HOLD TIME]`, `[HOMING CHECK GAP]`, `[HOMING DIRECTION]`, `[HOMING KEEP DISTANCE]`, `[HOMING TIME]`。

`[HOMING TO CHECKUP OBJECT]`, `[HOMING VELOCITY]`, `[HOMING Z AXIS]`, `[HP]`, `[HP APPENDAGE]`, `[HP LIMIT OFF]`, `[hp max]`, `[HP MAX]`, `[hp regen rate]`, `[ICE APPENDAGE]`。

`[ID]`, `[IF]`, `[IGNORE GHOSTMODE]`, `[IGNORE HIT STUN]`, `[IGNORE PREVIOUS ZOOM IT]`, `[IMG]`, `[IMMUNE ACTIVE STATUS]`, `[IMMUNE INACTIVE STATUS]`, `[IMPROVED INVINCIBLE]`, `[INCLUDE DEAD]`。

`[INDEX]`, `[INIT ROTATION]`, `[INIT ROTATION Z]`, `[INSIDE RANGE]`, `[INTERPOLATION MOVE TARGET]`, `[INTERVAL]`, `[IS ABSOLUTE MOVE]`, `[IS AI TARGET]`, `[IS ALL PLAYER IN MAP CHANGE SYSTEM]`, `[IS ATTACK ACTION]`。

`[IS BACKPOS]`, `[IS BASIC ACTION]`, `[IS BLOSSOM APPENDAGE STATE]`, `[IS CATEGORY]`, `[IS CHILD]`, `[IS COUNTER ACTION]`, `[IS DAMAGE ENABLE]`, `[IS DAMAGEBOX ENABLE]`, `[IS DARK DAMAGE]`, `[IS DIRECTION LEFT]`。

`[IS DIRECTION RIGHT]`, `[IS DIRECTION TO MOVE]`, `[IS DOWN]`, `[IS END MAP]`, `[IS END MAP RANGE]`, `[IS END MAP RANGE CHECK]`, `[IS END MAP VERTICALLY]`, `[IS ETC ACTION]`, `[IS FIRE DAMAGE]`, `[IS FRONTPOS]`。

`[IS GRABABLE]`, `[IS GROGGY ACTION]`, `[IS IN AREA]`, `[IS IN POINT AREA]`, `[IS IN POS]`, `[IS INDEX]`, `[IS LEFT]`, `[IS LIGHT DAMAGE]`, `[IS MAGICAL DAMAGE]`, `[IS NON TARGETED]`。

`[IS NONE DAMAGE]`, `[IS NOT ATTACK ACTION]`, `[IS NOT BASIC ACTION]`, `[IS NOT ETC ACTION]`, `[IS NOT INDEX]`, `[IS NOT TARGET STATE]`, `[IS OBJECT TYPE]`, `[IS ON]`, `[IS OURTEAMATTACKED]`, `[IS PASSIVE OBJECT]`。

`[IS PHYSICAL DAMAGE]`, `[IS RELATIVE COORD]`, `[IS RESPAWN MONSTER]`, `[IS RIGHT]`, `[IS TARGET STATE]`, `[IS TARGET STATES OR]`, `[IS TARGETACTIVESTATUS]`, `[IS TEAM]`, `[IS UP]`, `[IS WATER DAMAGE]`。

`[JUMP]`, `[JUMP HIGH]`, `[JUMP OUT]`, `[jump power]`, `[JUMP TIME]`, `[JUMP TO TARGET]`, `[JUMP TO TARGET EX]`, `[JUMPATTACK]`, `[KEEP STATE]`, `[KING]`。

`[KNOCK]`, `[KNOCK BACK]`, `[KNOCK BACK PIXEL]`, `[KNOCK BACK TYPE]`, `[knuck back]`, `[LAST]`, `[LAST ACTIVE ATTACKER]`, `[LAST ACTIVE ATTACKSUCCESS]`, `[LAST ATTACKER]`, `[LAST ATTACKSUCCESS]`。

`[LAST ATTACKSUCCESSES]`, `[LAST TARGET PRIORITY]`, `[LASTATTACK POSITION]`, `[LAYER]`, `[LAYER TYPE]`, `[LEFT]`, `[LENGTH]`, `[LENGTH RATE]`, `[LEVEL]`, `[LIFE TIME]`。

`[LIFT UP]`, `[light element]`, `[light element attack]`, `[lightning]`, `[LIMIT]`, `[LINKED OBJECT LIST]`, `[LOAD TARGET]`, `[LOCK QUEST UNTIL]`, `[LOOP ANI]`, `[LOW]`。

`[MAGIC CIRCLE]`, `[MAGICAL]`, `[magical attack]`, `[magical back attack critical rate]`, `[magical critical hit rate]`, `[magical damage reduce percent]`, `[magical defense]`, `[MAGICAL SHIELD]`, `[MAP CHANGE SYSTEM]`, `[MASTER]`。

`[MAX ROTATION]`, `[MAXTIME]`, `[ME]`, `[MESSAGE SEND]`, `[MESSAGE SEND ALL]`, `[MESSAGE SEND DELAY]`, `[MID]`, `[MIN DISTANCE]`, `[MIN MOVE DISTANCE]`, `[MIND CONTROL APPENDAGE]`。

`[MIRROR RANGE]`, `[MONSTER]`, `[MONSTER ACTION COOLTIME CHANGE]`, `[MONSTER ACTION COOLTIME CLEAR]`, `[MONSTER TEAM]`, `[MOTION]`, `[MOVABLE POS ONLY]`, `[MOVE]`, `[MOVE ACCELATE]`, `[MOVE APPENDAGE]`。

`[MOVE DIR]`, `[MOVE DISTANCE]`, `[MOVE DOWN FRAME]`, `[MOVE ME]`, `[MOVE METHOD DASH]`, `[MOVE PATTERN]`, `[MOVE PATTERN OFF]`, `[MOVE REDUCE]`, `[move speed]`, `[MOVE TARGET]`。

`[MOVE TIME]`, `[MOVE TO]`, `[MOVE TO DESTINATION]`, `[MOVE TO TARGET]`, `[MOVE TYPE]`, `[MOVE UNIFORM]`, `[MOVE UP FRAME]`, `[MOVEBACK]`, `[MP]`, `[mp regen rate]`。

`[MUCU LIMIT CONTROL]`, `[MY CASTING GAUGE]`, `[MY CURRENT DIRECTION]`, `[MY DIRECTION]`, `[MY OPPOSITE DIRECTION]`, `[MY TEAM]`, `[NAME]`, `[NAME HIDE OFF]`, `[NAME HIDE ON]`, `[NEAR]`。

`[NEAR BY]`, `[NEUTRAL]`, `[NEXT BEHAVIOR]`, `[no blood]`, `[NO DAMAGE MOTION]`, `[NO DROP]`, `[NO EFFECT]`, `[NO EXP]`, `[NO GOLD]`, `[non attraction]`。

`[non holding]`, `[non outline]`, `[NONE]`, `[none]`, `[NORMAL]`, `[normal]`, `[NOT BACK]`, `[NOT CHECK COUNTER HIT INCORRECT FRAME]`, `[NOT HAVE FOLLOWING OBJECT]`, `[NOT NEAR BY]`。

`[NOT USE DIRECTION]`, `[NOT USE OBJECT DIRECTION]`, `[NOT USE OBJECT ZPOS]`, `[NOTICE]`, `[NOTICE_BG]`, `[NOW]`, `[OBJECT SCALE]`, `[OBJECT SCALE EX]`, `[OCULAR SPECTRUM]`, `[OCULAR SPECTRUM DATA]`。

`[OFF]`, `[OFFSET]`, `[OFFSET POS]`, `[ON]`, `[ON ATTACKSUCCESS]`, `[ON CHANGE LIFE]`, `[ON COUNTER HIT]`, `[ON CREATE OBJECT]`, `[ON DAMAGE]`, `[ON DESTROY ME]`。

`[ON DESTROY OBJECT]`, `[ON END ACTION]`, `[ON END ANIMATION]`, `[ON END BEHAVIOR]`, `[ON MESSAGE]`, `[ON MOVE COLLISION]`, `[ON REMOVE ACTION]`, `[ON SET ACTION]`, `[ON SHAKE INPUT]`, `[ON START MAP]`。

`[ONESIDE MOVE]`, `[ONLY FIRST TIME]`, `[OTHER MAP VISIBLE OFF]`, `[OVERTURN]`, `[OZMA APC]`, `[OZMA CAMERA]`, `[PARABOLA]`, `[PARABOLA ACCEL]`, `[PARAM]`, `[PARENT MAP ONLY]`。

`[PARENT OFFSET]`, `[PARTICLE]`, `[PARTICLE EMITTER]`, `[PARTICLE FILENAME]`, `[PARTY TARGET]`, `[PASSIVE]`, `[PASSIVE INDEX]`, `[PASSIVE OBJECT]`, `[PASSIVE OBJECT INDEX]`, `[PATTERN]`。

`[PAUSE ACTION CHARACTER]`, `[physic]`, `[PHYSICAL]`, `[physical absolute damage]`, `[physical absolute defense]`, `[physical attack]`, `[physical attack bonus]`, `[physical back attack critical rate]`, `[physical critical hit rate]`, `[physical damage reduce percent]`。

`[physical defense]`, `[PHYSICAL SHIELD]`, `[PLAY]`, `[PLAY ANIMATION]`, `[PLAY SOUND]`, `[PLAY SOUND ID]`, `[PLAYER]`, `[POINT]`, `[poison]`, `[PONIT]`。

`[POS]`, `[POSITION TYPE]`, `[PROC]`, `[PULL APPENDAGE]`, `[PULL APPENDAGE EX]`, `[PUSH ASIDE]`, `[push aside]`, `[PUSH DUST INDEX]`, `[PUSH MOTION]`, `[PUSH MOTION DELAY TIME]`。

`[PUSH MOTION TIME]`, `[PUSH TIME]`, `[PUSH VELOCITY]`, `[PUSH VELOCITY Y]`, `[RADIUS]`, `[RAID SET SYMBOL]`, `[RANDOM]`, `[RANDOM CHECK]`, `[RANDOM GENERATE PASSIVE OBJECT]`, `[RANDOM HALF]`。

`[RANDOM SELECT]`, `[RANGE]`, `[REALDUNGEON CHECKUP]`, `[REDUCE DAMAGE]`, `[REFLECTBUFF APPENDAGE]`, `[REFRESH MOVEINFO]`, `[RELEASE RIDABLE OBJECT]`, `[REMOVE]`, `[REMOVE ACTIVE STATUS]`, `[REMOVE APPENDAGE]`。

`[REMOVE CATEGORY]`, `[REMOVE CHAIN LINE APPENDAGE]`, `[REMOVE FINAL DAMAGE RATE APPENDAGE]`, `[REMOVE LAYER]`, `[REMOVE VIRTUALHP]`, `[RESET]`, `[RESET ROSSALL SOUND APPENDAGE]`, `[RESIST ACTION]`, `[RESOLUTION APPENDAGE]`, `[RESTART COOLTIME]`。

`[RESTORE]`, `[RESTORE TARGET]`, `[REVERSE]`, `[REVERSE DIRECTION]`, `[REVERSE GAUGE]`, `[REVERSE HP]`, `[RGB CHANGE TIME]`, `[RGBA]`, `[RIGHT]`, `[RIGIDITY]`。

`[ROTATE]`, `[ROTATION]`, `[ROTERS BACKGROUND DOWN]`, `[ROTERS BACKGROUND UP]`, `[ROW]`, `[RPM]`, `[RSSET]`, `[SAVE POSITION]`, `[SAVE TARGET OBJECT]`, `[SAY SPEECH]`。

`[SAY SPEECH WITH POSITION]`, `[SCALE]`, `[SCALE PERCENT]`, `[SCENE TRANSITION SCREEN EFFECT]`, `[SCREEN EFFECT]`, `[SCREEN GAUGE]`, `[SEND DO BEHAVIOR]`, `[SEND MESSAGE]`, `[SET ABSOLUTE SUPER ARMOR]`, `[SET ACTION]`。

`[SET ALL SKILL ENABLE]`, `[SET ALPHA]`, `[SET BGM]`, `[SET CASTING GAUGEPOS]`, `[SET COLOR]`, `[SET COLOR KEY]`, `[SET DAMAGE BOX]`, `[SET DAMAGE CHECK]`, `[SET DIRECTION]`, `[SET DIRECTION TO CHECKUP]`。

`[SET FIX DIRECTION]`, `[SET FLYING MARK]`, `[SET FRAME]`, `[SET GRABABLE]`, `[SET HOLD DAMAGEANI]`, `[SET HOLD DOWNANI]`, `[SET HP]`, `[SET HP DESTROY]`, `[SET MONSTER FACE IMAGE]`, `[SET MOVE PARENT]`。

`[SET MOVEVELS]`, `[SET OUTLINE]`, `[SET OVERTURN]`, `[SET PARTY SYMBOL]`, `[SET PARTY TARGET]`, `[SET POS FORCE]`, `[SET POSITION CASTING GAUGE]`, `[SET POSITION HP GAUGE]`, `[SET POSITION NAME]`, `[SET RANDOM TARGET]`。

`[SET RESIST]`, `[SET REVOLUTION]`, `[SET SAVED TARGET]`, `[SET SPEED]`, `[SET SPEED MULTIPLE CONTROL]`, `[SET SUBANIMATION COLOR]`, `[SET SYMBOL]`, `[SET TARGET]`, `[SET TARGET FRAME]`, `[SET TEAM]`。

`[SET TOP PARENT]`, `[SET UNBEATABLE]`, `[SET USE REVOLUTION]`, `[SET VISIBLITY]`, `[SET WHOLE ALPHA]`, `[SET WHOLE DAMAGETYPE]`, `[SET WIDTH]`, `[SET X SPEED]`, `[SET Y SPEED]`, `[SET Z SPEED]`。

`[SHAKE INPUT]`, `[SHAKING]`, `[SHAKING GAGE]`, `[SHORT KNOCK BACK]`, `[SHOW HITGAUGE]`, `[SIT]`, `[SLAYER]`, `[sleep]`, `[slow]`, `[SLOW MOTION AT DAMAGED SUPER ARMOR ON]`。

`[SOUND]`, `[SOUND EX]`, `[SOUND PROBABILITY]`, `[SOURCE]`, `[SPEECH]`, `[SPEECH POS]`, `[SPEED]`, `[STAND]`, `[START ANGLE]`, `[START ANI]`。

`[START EFFECT LEVEL]`, `[START KEYSTROKE MODE]`, `[START POSITION]`, `[START RGBA]`, `[START X]`, `[START Y]`, `[STATE]`, `[STAUTS OF MAP CHANGE SYSTEM]`, `[STAY]`, `[STAY TIME]`。

`[stone]`, `[STOP DUNGEON ZOOM IN]`, `[STOP DUNGEON ZOOM OUT]`, `[STOP MOVE UNABLE POS]`, `[STRAIGHT HOMING]`, `[STRAIGHT HOMING Y AXIS REVISION]`, `[stuck]`, `[stun]`, `[SUB ANI]`, `[SUB ANI FLAG]`。

`[SUB ANI WITH XY]`, `[SUB ANI WITH XYZ]`, `[SUB ANIMATION INDICES]`, `[SUFFOCATION APPENDAGE]`, `[SUMMON APC]`, `[SUMMON MARK]`, `[SUMMON MASTER]`, `[SUMMON MASTER COPY]`, `[SUMMON MONSTER]`, `[SUMMON OBJECT]`。

`[SUMMON TIME]`, `[SUMMON TYPE]`, `[SUPER ARMOR]`, `[SUPER DAMAGE]`, `[SUPER DOWN]`, `[SYNC ANIMATION ROTATION]`, `[SYNC TARGET MOVE]`, `[TARGET]`, `[TARGET CASTING]`, `[TARGET CASTING CANCEL]`。

`[TARGET CASTING TIME]`, `[TARGET DISTANCE]`, `[TARGET EXTEND CIRCLE]`, `[TARGET OFFSET]`, `[TARGET VELOCITY REGION]`, `[TEAM]`, `[TELEKINESIS APPENDAGE]`, `[TELEPORT]`, `[THORNS APPENDAGE]`, `[THROWING SPEED]`。

`[TIME]`, `[TIME CHANGE APPENDAGE]`, `[TIME VALUE]`, `[TO BEFORE]`, `[TO SAVE TARGET]`, `[TO TARGET]`, `[TRANSITION OPTION]`, `[TRIGGER]`, `[TRIGGER CHECK]`, `[TRIGGER QUESTEVENT]`。

`[TYPE]`, `[UNIFORM]`, `[UNINTERRUPTIBLE]`, `[UNLOCK QUEST]`, `[UP]`, `[UPDATE VAR]`, `[USE ANGLE]`, `[USE DUNGEON MOVABLE RATE]`, `[USE EFFECT]`, `[USE MAP POS]`。

`[USE MAP ZPOS]`, `[USE MaY DIRECTION]`, `[USE ME X POSITION]`, `[USE MONOCHROME]`, `[USE MY BASE POS]`, `[USE MY BASEPOS]`, `[USE MY DIRECTION]`, `[USE MY DIRECTION BASE]`, `[USE MY POS]`, `[USE MY TEAM]`。

`[USE NEUTRAL TEAM]`, `[USE NEXT ACTION]`, `[USE OBJECT ZPOS]`, `[USE ORI POS]`, `[USE PARENT ACTION]`, `[USE PARENT BASEPOS]`, `[USE PARENT DIRECTION]`, `[USE RANDOM POS]`, `[USE REVOLUTION]`, `[USE TARGET]`。

`[USE TARGET BASEPOS]`, `[USE TARGET POS]`, `[USE TARGET POS LIMITED]`, `[USE TARGET POS UNLIMITED]`, `[USE TARGET TEAM]`, `[USE ZPOS OFFSET]`, `[USE ZPOS ZERO]`, `[VALIDTIME]`, `[VALUE]`, `[VELOCITY]`。

`[VIRTUALHP APPENDAGE]`, `[WARNING MARK]`, `[water element]`, `[water element attack]`, `[weapon break]`, `[WHICH]`, `[WIND APPENDAGE]`, `[WITHIN SIGHT]`, `[WITHOUT SUMMONER DIE]`, `[X AXIS]`。

`[X END]`, `[X NORMAL]`, `[X SLANT]`, `[X START]`, `[XPOS]`, `[Y AXIS]`, `[Y AXIS RATE]`, `[Y END]`, `[Y NORMAL]`, `[Y SCALE]`。

`[Y SLANT]`, `[Y START]`, `[Z AXIS]`, `[Z END]`, `[Z OFFSET]`, `[Z START]`, `[ZOOM IN AFTER MOVE]`, `[ZOOM IT]`, `[ZOOM IT PLUS]`, `[ZOOM IT PLUS OUT]`。

`[ZOOM OUT]`, `[ZOOM OUT BEFORE MOVE]`, `[ZOOM OUT MAINTAIN FOCUS]`, `[ZOOM RATE]`, `[ZOOM TIME]`, `[ZPOS]`, `[ZSPEED]`。

## 全量闭合标签

`[/ACTION INDICES]`, `[/ADD ANI TO OBJECT]`, `[/ADD ANIMATION EX]`, `[/ADD APPENDAGE]`, `[/APPENDAGE]`, `[/ARG VAR]`, `[/BEHAVIOR]`, `[/CASTING]`, `[/CASTING EX]`, `[/CHAIN LINE APPENDAGE]`。

`[/CHANGE MAP]`, `[/CHARACTERISTIC]`, `[/CHECK PLAYER NUM]`, `[/CHECKUP]`, `[/COLOR CHANGE EFFECT]`, `[/COUNTER HIT INFO]`, `[/CREATE PASSIVEOBJECT]`, `[/CREATE PASSIVEOBJECT CIRCLE]`, `[/CUSTOM ID UI CREATE]`, `[/CUT SCENE]`。

`[/DAMAGE]`, `[/DELETE APPENDAGE]`, `[/DIM]`, `[/DRAW UI LAYER ANIMATION]`, `[/DUNGEON INDEX]`, `[/DUNGEON NOT INDEX]`, `[/EX GAUGE MODE]`, `[/FLASH SCREEN]`, `[/FRAME]`, `[/FRAME SET]`。

`[/GET OUT]`, `[/GRAB OFF]`, `[/GRAB ON]`, `[/GUARD APPENDAGE]`, `[/HOMING TO CHECKUP OBJECT]`, `[/HP APPENDAGE]`, `[/IF]`, `[/IMMUNE ACTIVE STATUS]`, `[/IMMUNE INACTIVE STATUS]`, `[/IMPROVED INVINCIBLE]`。

`[/INDEX]`, `[/INTERPOLATION MOVE TARGET]`, `[/IS BLOSSOM APPENDAGE STATE]`, `[/IS CATEGORY]`, `[/IS IDEX]`, `[/IS IN AREA]`, `[/IS IN POINT AREA]`, `[/IS INDEX]`, `[/IS NON TARGETED]`, `[/IS NOT INDEX]`。

`[/IS NOT TARGET STATE]`, `[/IS OBJECT TYPE]`, `[/IS TARGET STATE]`, `[/IS TARGET STATES OR]`, `[/IS TARGETACTIVESTATUS]`, `[/IS TEAM]`, `[/ISNDEX]`, `[/JUMP TO TARGET EX]`, `[/LINKED OBJECT LIST]`, `[/MAP CHANGE SYSTEM]`。

`[/MONSTER ACTION COOLTIME CHANGE]`, `[/MONSTER ACTION COOLTIME CLEAR]`, `[/MOTION]`, `[/MOVE DIR]`, `[/MOVE PATTERN]`, `[/MOVE TO DESTINATION]`, `[/NEAR BY]`, `[/NOT NEAR BY]`, `[/NOTICE]`, `[/NOTICE_BG]`。

`[/OCULAR SPECTRUM]`, `[/OCULAR SPECTRUM DATA]`, `[/PARAM]`, `[/PARTY TARGET]`, `[/PASSIVE OBJECT INDEX]`, `[/PLAY ANIMATION]`, `[/PULL APPENDAGE]`, `[/PULL APPENDAGE EX]`, `[/RANDOM]`, `[/RANDOM GENERATE PASSIVE OBJECT]`。

`[/RANDOM SELECT]`, `[/RANDOM SET]`, `[/REMOVE APPENDAGE]`, `[/SCENE TRANSITION SCREEN EFFECT]`, `[/SCREEN EFFECT]`, `[/SET BGM]`, `[/SET MOVEVELS]`, `[/SET POS FORCE]`, `[/SET REVOLUTION]`, `[/SET SPEED]`。

`[/SET SPEED MULTIPLE CONTROL]`, `[/SET SUBANIMATION COLOR]`, `[/SHOW HITGAUGE]`, `[/SOUND]`, `[/SOUND EX]`, `[/SOUND PROBABILITY]`, `[/SPEECH]`, `[/SPEECH POS]`, `[/START KEYSTROKE MODE]`, `[/SUB ANI]`。

`[/SUB ANI WITH XY]`, `[/SUB ANI WITH XYZ]`, `[/SUB ANIMATION INDICES]`, `[/SUFFOCATION APPENDAGE]`, `[/SUMMON APC]`, `[/SUMMON MONSTER]`, `[/SUPER DAMAGE]`, `[/SUPER DOWN]`, `[/TARGET CASTING]`, `[/TARGET EXTEND CIRCLE]`。

`[/TARGET VELOCITY REGION]`, `[/TEAM]`, `[/TELEPORT]`, `[/TIRGGER]`, `[/TRIGGER]`, `[/UPDATE VAR]`, `[/ZOOM IT PLUS]`。

## 字段统计表

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[-]` | 2 | 17 | 13 |
| `[!=]` | 2 | 24 | 15 |
| `[%]` | 2 | 2966 | 1446 |
| `[+]` | 2 | 2333 | 1606 |
| `[<]` | 2 | 1059 | 791 |
| `[<=]` | 2 | 4557 | 3013 |
| `[=]` | 2 | 4986 | 1883 |
| `[=<]` | 2 | 226 | 134 |
| `[==]` | 1 | 1 | 1 |
| `[=>]` | 2 | 686 | 461 |
| `[>]` | 2 | 1592 | 1075 |
| `[>=]` | 2 | 2519 | 1289 |
| `[ABS CASTING]` | 2 | 206 | 135 |
| `[ABSOLUTE]` | 1 | 60 | 48 |
| `[ACCEL]` | 1 | 155 | 89 |
| `[ACCEL MOVE]` | 1 | 9 | 9 |
| `[ACCEL OPTION]` | 1 | 9 | 9 |
| `[ACTION INDICES]` | 1 | 5 | 2 |
| `[ACTIVE STATUS]` | 2 | 410 | 307 |
| `[ACTIVE SYSTEM]` | 1 | 6 | 6 |
| `[ADD ANI TO OBJECT]` | 1 | 2 | 1 |
| `[ADD ANIMATION]` | 1 | 160 | 69 |
| `[ADD ANIMATION EX]` | 1 | 126 | 64 |
| `[ADD APPENDAGE]` | 1 | 7 | 7 |
| `[ADD CATEGORY]` | 2 | 500 | 381 |
| `[ADD LAYER]` | 2 | 174 | 75 |
| `[ADD RESIST]` | 1 | 4 | 3 |
| `[AGAMEMNON TELEKINESIS]` | 2 | 4 | 4 |
| `[AI CHARACTER]` | 2 | 70 | 53 |
| `[ALL]` | 2 | 46 | 43 |
| `[all]` | 1 | 1 | 1 |
| `[all active status resistance]` | 2 | 67 | 50 |
| `[ALL ALIVE]` | 2 | 4 | 4 |
| `[ALL CHARACTER TEAM]` | 2 | 579 | 318 |
| `[all element]` | 2 | 32 | 32 |
| `[ALL ENEMY]` | 2 | 488 | 376 |
| `[ALL MONSTER TEAM]` | 2 | 241 | 131 |
| `[ALL OUR TEAM]` | 2 | 26 | 22 |
| `[ALLOW FIXTURE]` | 2 | 166 | 101 |
| `[ALLOW OUT MAP]` | 1 | 13 | 11 |
| `[ALWAYS STRAIGHT HOMING]` | 1 | 1 | 1 |
| `[ANGER]` | 2 | 2 | 2 |
| `[ANGER APPENDAGE]` | 2 | 2 | 2 |
| `[ANI FILE]` | 2 | 71 | 64 |
| `[ANI PATH]` | 1 | 161 | 93 |
| `[APPEND DELAY TIME]` | 1 | 2 | 2 |
| `[APPEND HIT]` | 2 | 55 | 45 |
| `[APPENDAGE]` | 2 | 787 | 728 |
| `[APPENDAGE TIME]` | 1 | 1 | 1 |
| `[AREA]` | 2 | 20 | 20 |
| `[ARG VAR]` | 1 | 60 | 12 |
| `[armor break]` | 1 | 7 | 7 |
| `[ATTACK]` | 2 | 9716 | 6575 |
| `[attack direction]` | 1 | 1 | 1 |
| `[attack enemy]` | 1 | 1 | 1 |
| `[attack speed]` | 2 | 198 | 185 |
| `[attack type]` | 1 | 1 | 1 |
| `[ATTACK_COMMAND]` | 2 | 49 | 43 |
| `[ATTACKABLEAREA APPENDAGE]` | 2 | 4 | 4 |
| `[ATTACKRECT]` | 2 | 1857 | 1497 |
| `[AUTOEND]` | 2 | 22 | 22 |
| `[AXIS INDEX]` | 2 | 18 | 17 |
| `[BACK ATTACK]` | 2 | 7 | 7 |
| `[BACKSIDE]` | 2 | 4 | 4 |
| `[BASE ANI]` | 2 | 41623 | 41622 |
| `[BEGIN IF]` | 1 | 51 | 39 |
| `[BEHAVIOR]` | 2 | 66655 | 21177 |
| `[BEHAVIOR WHEN ARRIVE]` | 1 | 4 | 4 |
| `[bleeding]` | 2 | 51 | 35 |
| `[bless]` | 2 | 2 | 2 |
| `[blind]` | 2 | 39 | 39 |
| `[BLOSSOM APPENDAGE]` | 1 | 1 | 1 |
| `[BLOSSOM APPENDAGE ADD STACK]` | 1 | 3 | 2 |
| `[BLOSSOM APPENDAGE CHANGE STATUS]` | 1 | 5 | 2 |
| `[BLOSSOM DANDELION APPENDAGE BURST]` | 1 | 3 | 3 |
| `[BLOSSOM_APPENDAGE]` | 1 | 2 | 1 |
| `[blow]` | 1 | 1 | 1 |
| `[burn]` | 2 | 62 | 62 |
| `[CAMOUFLAGE]` | 2 | 108 | 75 |
| `[CAN ANOHTER BEHAVIOR]` | 1 | 4 | 4 |
| `[CANCEL CASTING]` | 1 | 1 | 1 |
| `[cast speed]` | 2 | 50 | 50 |
| `[CASTING]` | 2 | 1099 | 1004 |
| `[CASTING EX]` | 2 | 149 | 147 |
| `[CENTER MSG]` | 2 | 184 | 158 |
| `[CHAIN LINE APPENDAGE]` | 1 | 32 | 31 |
| `[CHANGE]` | 1 | 4 | 2 |
| `[CHANGE ACTION FILE]` | 2 | 3463 | 869 |
| `[CHANGE AI]` | 2 | 643 | 183 |
| `[CHANGE ATTACKINFO]` | 2 | 260 | 211 |
| `[CHANGE ATTACKINFO TARGET]` | 1 | 14 | 8 |
| `[CHANGE BASE ANIMATION]` | 1 | 86 | 14 |
| `[CHANGE DIRECTION BY TARGET]` | 2 | 100 | 97 |
| `[CHANGE DISGUISER]` | 2 | 10 | 10 |
| `[CHANGE FLOATING HEIGHT]` | 2 | 543 | 350 |
| `[CHANGE GRAVITY]` | 2 | 69 | 54 |
| `[CHANGE MAP]` | 1 | 2 | 2 |
| `[CHANGE MODULE]` | 2 | 4 | 4 |
| `[CHANGE MY TARGET]` | 2 | 177 | 166 |
| `[CHANGE NAME]` | 1 | 2 | 2 |
| `[CHANGE RADIUS]` | 1 | 4 | 3 |
| `[CHANGE RIDABLESKILL PATTERN]` | 2 | 4 | 4 |
| `[CHANGE SIGHT]` | 2 | 2 | 2 |
| `[CHANGE SIZE END]` | 2 | 156 | 133 |
| `[CHANGE SIZE START]` | 2 | 110 | 87 |
| `[CHANGE STATE SKIP]` | 1 | 63 | 60 |
| `[CHANGE STATUS DAMAGE REDUCE]` | 1 | 1 | 1 |
| `[CHANGE STATUS TO OTHERSIDE OF MAP CHANGE SYSTEM]` | 1 | 6 | 6 |
| `[CHANGE TEAM]` | 2 | 17 | 5 |
| `[CHANGE TIME]` | 2 | 266 | 241 |
| `[CHARACTER]` | 2 | 3360 | 2029 |
| `[CHARACTER ATTACKSUCCESS]` | 2 | 260 | 49 |
| `[CHARACTER COOLTIME RESET]` | 2 | 18 | 18 |
| `[CHARACTER ONLY]` | 1 | 2 | 2 |
| `[CHARACTER TEAM]` | 1 | 3 | 3 |
| `[CHARACTERISTIC]` | 1 | 14 | 14 |
| `[CHARCTER TEAM]` | 2 | 4 | 4 |
| `[CHARGED TIME]` | 2 | 4 | 2 |
| `[CHECK AREA]` | 2 | 8 | 2 |
| `[CHECK BUFF]` | 2 | 14 | 14 |
| `[CHECK DISTANCE]` | 2 | 113 | 65 |
| `[CHECK GHOST]` | 2 | 10 | 10 |
| `[CHECK NEXT]` | 2 | 144 | 48 |
| `[CHECK OBJECT]` | 1 | 2 | 2 |
| `[CHECK PARTY SYMBOL]` | 2 | 25 | 11 |
| `[CHECK PARTYMEMBERS STATE]` | 2 | 8 | 4 |
| `[CHECK PLAYER NUM]` | 1 | 35 | 6 |
| `[CHECK RAID SYMBOL]` | 1 | 19 | 13 |
| `[CHECK SPECIFIC BUFF]` | 2 | 9 | 9 |
| `[CHECK SPECIFIC BUFF NOT]` | 1 | 1 | 1 |
| `[CHECK STUCK]` | 2 | 41 | 38 |
| `[CHECK SYMBOL]` | 1 | 161 | 52 |
| `[CHECK TIME]` | 2 | 957 | 589 |
| `[CHECKED NO]` | 2 | 5102 | 2798 |
| `[CHECKED OBJECT]` | 1 | 11 | 11 |
| `[CHECKTIME]` | 1 | 1 | 1 |
| `[CHECKUP]` | 2 | 11602 | 6172 |
| `[CHECKUP OBJECT]` | 2 | 9454 | 5058 |
| `[CINEMATIC]` | 1 | 2 | 1 |
| `[CLEAR ANI]` | 1 | 4 | 1 |
| `[CLOSE]` | 1 | 59 | 48 |
| `[close]` | 1 | 1 | 1 |
| `[COLLISION GROUP]` | 2 | 63 | 45 |
| `[COLOR]` | 1 | 22 | 21 |
| `[COLOR CHANGE EFFECT]` | 2 | 266 | 241 |
| `[COMPARE VAR]` | 1 | 35 | 22 |
| `[confuse]` | 2 | 39 | 35 |
| `[COOL TIME]` | 1 | 6 | 6 |
| `[COORDINATE]` | 2 | 81 | 49 |
| `[COUNT]` | 1 | 35 | 6 |
| `[COUNTER HIT INFO]` | 1 | 44 | 34 |
| `[cover]` | 1 | 12 | 12 |
| `[CREATE COUNT]` | 1 | 22 | 11 |
| `[CREATE FREQUENCE]` | 1 | 8 | 1 |
| `[CREATE NUM]` | 1 | 5 | 1 |
| `[CREATE OBJECT]` | 2 | 2 | 2 |
| `[CREATE PASSIVEOBJECT]` | 2 | 25804 | 9644 |
| `[CREATE PASSIVEOBJECT CIRCLE]` | 1 | 22 | 11 |
| `[CREATE PUSH DUST]` | 1 | 23 | 22 |
| `[CREATE STOP DUST]` | 1 | 23 | 22 |
| `[CREATE TERM]` | 1 | 4 | 4 |
| `[curse]` | 2 | 15 | 15 |
| `[CURSE APPENDAGE]` | 2 | 2 | 2 |
| `[CUSTOM]` | 2 | 1946 | 1340 |
| `[CUSTOM ID UI ALL CLEAR]` | 1 | 1 | 1 |
| `[CUSTOM ID UI CREATE]` | 1 | 4 | 1 |
| `[CUSTOM ID UI DELETE]` | 1 | 8 | 1 |
| `[CUT SCENE]` | 2 | 71 | 64 |
| `[DAMAGE]` | 2 | 733 | 346 |
| `[DAMAGE APPENDAGE]` | 2 | 2 | 2 |
| `[DAMAGE MOTION]` | 2 | 18 | 14 |
| `[damage reaction]` | 1 | 1 | 1 |
| `[DAMAGE TRANSFER APPENDAGE]` | 1 | 2 | 2 |
| `[DAMAGE1]` | 1 | 3 | 3 |
| `[dark element]` | 2 | 18 | 17 |
| `[dark element attack]` | 1 | 4 | 3 |
| `[DARKNESS]` | 1 | 12 | 11 |
| `[DARKNESS LIGHT]` | 1 | 28 | 27 |
| `[DARKSCALP]` | 2 | 2 | 2 |
| `[DASH]` | 2 | 4 | 4 |
| `[DASHATTACK]` | 2 | 4 | 4 |
| `[DEBUFF]` | 2 | 20 | 18 |
| `[DEBUFF GHOST]` | 2 | 15 | 15 |
| `[DEFAULT]` | 2 | 318 | 299 |
| `[DEFAULT ATTACKINFO]` | 2 | 66 | 66 |
| `[DEFAULT SIGHT]` | 2 | 2 | 2 |
| `[DEFAULT TEAM]` | 2 | 4 | 4 |
| `[DELAY DO BEHAVIOR]` | 2 | 1087 | 235 |
| `[DELETE APPENDAGE]` | 2 | 94 | 78 |
| `[DEPENDENT ACTION]` | 2 | 18 | 18 |
| `[DESOLATEPAIN APPENDAGE]` | 2 | 2 | 2 |
| `[DESTINATION]` | 1 | 4 | 4 |
| `[DESTROY]` | 2 | 1869 | 1752 |
| `[DESTROY BY FORCE]` | 2 | 16 | 16 |
| `[DESTROY OBJECT]` | 2 | 30 | 28 |
| `[DESTROY WHEN PARENT DIE]` | 1 | 20 | 15 |
| `[DIALOG]` | 1 | 6 | 5 |
| `[DIE]` | 1 | 6 | 6 |
| `[DIE_COMMAND]` | 2 | 11 | 11 |
| `[DIFF ROTATION]` | 1 | 1 | 1 |
| `[DIM]` | 2 | 3202 | 1639 |
| `[DIRECT DO BEHAVIOR]` | 2 | 220 | 196 |
| `[DIRECTION]` | 2 | 106 | 59 |
| `[DIRECTION RELATIVE]` | 1 | 13 | 11 |
| `[DISPLAY ME]` | 2 | 103 | 102 |
| `[DISPLAY ONLY SCREEN]` | 1 | 14 | 14 |
| `[DISPLAY SCREEN]` | 2 | 14 | 14 |
| `[DISPLAY SCREEN ONLY]` | 1 | 1 | 1 |
| `[DISPLAY TARGET]` | 1 | 3 | 3 |
| `[DISTANCE]` | 2 | 3028 | 1979 |
| `[DISTANCE MAX]` | 1 | 5 | 1 |
| `[DISTANCE MIN]` | 1 | 5 | 1 |
| `[DO BEHAVIOR]` | 2 | 74972 | 20625 |
| `[DO ME]` | 2 | 101 | 100 |
| `[DO PROC BEHAVIOR]` | 2 | 1375 | 517 |
| `[DONT OVERLAP]` | 1 | 3 | 3 |
| `[DOWN]` | 2 | 463 | 435 |
| `[dragon]` | 1 | 2 | 2 |
| `[DRAW UI LAYER ANIMATION]` | 1 | 2 | 2 |
| `[DRIECTION]` | 1 | 4 | 4 |
| `[DUNGEON]` | 1 | 12 | 11 |
| `[DUNGEON INDEX]` | 1 | 3 | 2 |
| `[DUNGEON NOT INDEX]` | 1 | 3 | 2 |
| `[DUNGEON SYMBOL CALC]` | 1 | 13 | 11 |
| `[DUNGEON SYMBOL COMPARE]` | 1 | 186 | 37 |
| `[DUNGEON SYMBOL RANDOM SET]` | 1 | 1 | 1 |
| `[DUNGEON SYMBOL SET]` | 1 | 147 | 62 |
| `[DUNGEON SYMBOL SYNC]` | 1 | 21 | 8 |
| `[DURATION]` | 1 | 3 | 3 |
| `[DURATION TIME]` | 1 | 4 | 2 |
| `[EACH CREATE POS RANDOM]` | 1 | 11 | 6 |
| `[EASY]` | 1 | 4 | 2 |
| `[EFFECT ALPHA END]` | 2 | 154 | 146 |
| `[EFFECT ALPHA START]` | 2 | 17 | 16 |
| `[EFFECT BLUE END]` | 2 | 27 | 24 |
| `[EFFECT BLUE START]` | 2 | 44 | 39 |
| `[EFFECT GREEN END]` | 2 | 29 | 25 |
| `[EFFECT GREEN START]` | 2 | 15 | 13 |
| `[EFFECT RED END]` | 2 | 157 | 146 |
| `[EFFECT RED START]` | 2 | 33 | 27 |
| `[element]` | 1 | 7 | 7 |
| `[elemental property]` | 1 | 1 | 1 |
| `[ELLIPSE_RATE]` | 1 | 4 | 3 |
| `[ELSE]` | 1 | 24 | 19 |
| `[ELSE IF]` | 1 | 42 | 19 |
| `[ENABLE]` | 2 | 4369 | 2416 |
| `[ENABLE OFF]` | 2 | 4 | 4 |
| `[END]` | 2 | 1398 | 1278 |
| `[END ANI]` | 1 | 4 | 1 |
| `[END EFFECT LEVEL]` | 1 | 1 | 1 |
| `[END FRAME]` | 1 | 51 | 49 |
| `[END IF]` | 1 | 52 | 40 |
| `[END KEYSTROKE MODE]` | 2 | 8 | 8 |
| `[END RGBA]` | 1 | 1 | 1 |
| `[END SOURCE STATE]` | 1 | 1 | 1 |
| `[ENEMY TEAM]` | 2 | 33 | 29 |
| `[equipment magical attack]` | 2 | 77 | 76 |
| `[equipment magical defense]` | 2 | 208 | 193 |
| `[equipment magicel defense]` | 1 | 1 | 1 |
| `[equipment physical attack]` | 2 | 136 | 126 |
| `[equipment physical defense]` | 2 | 220 | 205 |
| `[ETC IGNORE COLLISION]` | 1 | 3 | 1 |
| `[ETC IGNORE MOVE AI]` | 1 | 1 | 1 |
| `[ETC_COMMAND]` | 2 | 111 | 109 |
| `[EVEN ONE DEATH]` | 2 | 4 | 4 |
| `[EX GAUGE MODE]` | 1 | 12 | 11 |
| `[EXCHANGE HP RATE]` | 2 | 4 | 4 |
| `[EXPERT]` | 2 | 100 | 91 |
| `[FACE TO FACE]` | 2 | 20 | 14 |
| `[FAR]` | 1 | 1 | 1 |
| `[FILTER VAR]` | 1 | 14 | 6 |
| `[FINAL DAMAGE RATE APPENDAGE]` | 1 | 4 | 4 |
| `[FIND MOVABLE POS]` | 1 | 68 | 36 |
| `[fire element]` | 2 | 26 | 26 |
| `[fire element attack]` | 2 | 4 | 4 |
| `[FIX DIRECTION]` | 2 | 2413 | 483 |
| `[FIX TARGET ME]` | 2 | 8 | 8 |
| `[FIXTURE]` | 2 | 427 | 392 |
| `[fixture]` | 2 | 523 | 352 |
| `[FLASH SCREEN]` | 2 | 920 | 753 |
| `[FLASH SCREEN EX]` | 2 | 6 | 6 |
| `[FLASH SCREEN OFF]` | 2 | 44 | 34 |
| `[FLIP TYPE]` | 2 | 44 | 37 |
| `[FOCUS]` | 1 | 1 | 1 |
| `[FOLLOW PARENT DIRECTION]` | 1 | 1 | 1 |
| `[FOLLOWING TARGET]` | 2 | 1163 | 775 |
| `[FOLLOWING TARGET FLIP]` | 1 | 3 | 1 |
| `[FORCE]` | 2 | 228 | 227 |
| `[FORCE HIT STUN TIME]` | 1 | 3 | 3 |
| `[FORCED FALLOW TARGET LEVEL]` | 1 | 1 | 1 |
| `[FRAME]` | 2 | 54600 | 18183 |
| `[FRAME JUST]` | 1 | 317 | 89 |
| `[FRAME SET]` | 1 | 24 | 17 |
| `[freeze]` | 2 | 22 | 17 |
| `[FREQUENCY TIME]` | 1 | 2 | 2 |
| `[FRONT]` | 1 | 4 | 4 |
| `[FRONTSIDE]` | 2 | 90 | 40 |
| `[GAUGE COORD POS]` | 1 | 14 | 13 |
| `[GAUGE COORD TYPE]` | 1 | 14 | 13 |
| `[GENERATE AREA]` | 1 | 8 | 1 |
| `[GET DUNGEON TIME]` | 1 | 35 | 13 |
| `[GET OUT]` | 1 | 4 | 4 |
| `[GET TARGET]` | 2 | 1788 | 1273 |
| `[GET TIME]` | 2 | 3271 | 1130 |
| `[good hit]` | 1 | 1 | 1 |
| `[GRAB]` | 1 | 4 | 3 |
| `[GRAB OFF]` | 2 | 27 | 27 |
| `[GRAB ON]` | 1 | 19 | 19 |
| `[GRAPHIC EFFECT]` | 1 | 1 | 1 |
| `[GUARD APPENDAGE]` | 2 | 7 | 7 |
| `[haste]` | 2 | 40 | 40 |
| `[HAVE FOLLOWING OBJECT]` | 1 | 5 | 2 |
| `[HEIGHT]` | 1 | 4 | 4 |
| `[HELLOFHEAL APPENDAGE]` | 2 | 6 | 6 |
| `[HERO]` | 2 | 10 | 10 |
| `[HIGH]` | 2 | 411 | 319 |
| `[HIT DELAY]` | 2 | 18 | 14 |
| `[hit down]` | 1 | 1 | 1 |
| `[HIT EFFECT]` | 1 | 1 | 1 |
| `[hit info]` | 1 | 1 | 1 |
| `[hit recovery]` | 2 | 65 | 53 |
| `[HIT TYPE]` | 1 | 11 | 7 |
| `[hit wav]` | 1 | 1 | 1 |
| `[HOLD]` | 2 | 351 | 273 |
| `[hold]` | 2 | 30 | 26 |
| `[HOLD TIME]` | 1 | 9 | 9 |
| `[HOMING CHECK GAP]` | 1 | 1 | 1 |
| `[HOMING DIRECTION]` | 1 | 1 | 1 |
| `[HOMING KEEP DISTANCE]` | 1 | 1 | 1 |
| `[HOMING TIME]` | 1 | 1 | 1 |
| `[HOMING TO CHECKUP OBJECT]` | 1 | 1 | 1 |
| `[HOMING VELOCITY]` | 1 | 1 | 1 |
| `[HOMING Z AXIS]` | 1 | 1 | 1 |
| `[HP]` | 2 | 1510 | 1015 |
| `[HP APPENDAGE]` | 2 | 28 | 28 |
| `[HP LIMIT OFF]` | 1 | 1 | 1 |
| `[hp max]` | 2 | 46 | 46 |
| `[HP MAX]` | 2 | 22 | 22 |
| `[hp regen rate]` | 2 | 50 | 37 |
| `[ICE APPENDAGE]` | 2 | 19 | 16 |
| `[ID]` | 2 | 118 | 91 |
| `[IF]` | 2 | 3244 | 1605 |
| `[IGNORE GHOSTMODE]` | 1 | 21 | 20 |
| `[IGNORE HIT STUN]` | 1 | 168 | 168 |
| `[IGNORE PREVIOUS ZOOM IT]` | 1 | 2 | 2 |
| `[IMG]` | 1 | 29 | 28 |
| `[IMMUNE ACTIVE STATUS]` | 1 | 12 | 12 |
| `[IMMUNE INACTIVE STATUS]` | 1 | 1 | 1 |
| `[IMPROVED INVINCIBLE]` | 1 | 2 | 1 |
| `[INCLUDE DEAD]` | 1 | 149 | 33 |
| `[INDEX]` | 2 | 27635 | 10187 |
| `[INIT ROTATION]` | 1 | 1 | 1 |
| `[INIT ROTATION Z]` | 1 | 1 | 1 |
| `[INSIDE RANGE]` | 1 | 4 | 4 |
| `[INTERPOLATION MOVE TARGET]` | 1 | 202 | 119 |
| `[INTERVAL]` | 1 | 1 | 1 |
| `[IS ABSOLUTE MOVE]` | 1 | 4 | 4 |
| `[IS AI TARGET]` | 1 | 2 | 1 |
| `[IS ALL PLAYER IN MAP CHANGE SYSTEM]` | 1 | 4 | 4 |
| `[IS ATTACK ACTION]` | 1 | 14 | 8 |
| `[IS BACKPOS]` | 1 | 25 | 25 |
| `[IS BASIC ACTION]` | 1 | 3 | 3 |
| `[IS BLOSSOM APPENDAGE STATE]` | 1 | 14 | 4 |
| `[IS CATEGORY]` | 2 | 4 | 4 |
| `[IS CHILD]` | 2 | 33 | 25 |
| `[IS COUNTER ACTION]` | 1 | 15 | 15 |
| `[IS DAMAGE ENABLE]` | 2 | 18 | 18 |
| `[IS DAMAGEBOX ENABLE]` | 2 | 5 | 5 |
| `[IS DARK DAMAGE]` | 2 | 8 | 4 |
| `[IS DIRECTION LEFT]` | 2 | 37 | 28 |
| `[IS DIRECTION RIGHT]` | 2 | 36 | 27 |
| `[IS DIRECTION TO MOVE]` | 2 | 14 | 12 |
| `[IS DOWN]` | 1 | 1 | 1 |
| `[IS END MAP]` | 2 | 72 | 66 |
| `[IS END MAP RANGE]` | 1 | 12 | 12 |
| `[IS END MAP RANGE CHECK]` | 1 | 1 | 1 |
| `[IS END MAP VERTICALLY]` | 2 | 8 | 8 |
| `[IS ETC ACTION]` | 1 | 4 | 3 |
| `[IS FIRE DAMAGE]` | 2 | 70 | 40 |
| `[IS FRONTPOS]` | 2 | 71 | 36 |
| `[IS GRABABLE]` | 2 | 308 | 249 |
| `[IS GROGGY ACTION]` | 1 | 8 | 8 |
| `[IS IN AREA]` | 2 | 93 | 58 |
| `[IS IN POINT AREA]` | 2 | 5 | 4 |
| `[IS IN POS]` | 2 | 136 | 15 |
| `[IS INDEX]` | 2 | 6434 | 3641 |
| `[IS LEFT]` | 2 | 127 | 114 |
| `[IS LIGHT DAMAGE]` | 2 | 8 | 4 |
| `[IS MAGICAL DAMAGE]` | 1 | 5 | 4 |
| `[IS NON TARGETED]` | 1 | 2 | 1 |
| `[IS NONE DAMAGE]` | 2 | 4 | 4 |
| `[IS NOT ATTACK ACTION]` | 1 | 28 | 6 |
| `[IS NOT BASIC ACTION]` | 1 | 2 | 2 |
| `[IS NOT ETC ACTION]` | 1 | 40 | 20 |
| `[IS NOT INDEX]` | 2 | 515 | 91 |
| `[IS NOT TARGET STATE]` | 2 | 92 | 64 |
| `[IS OBJECT TYPE]` | 2 | 1020 | 709 |
| `[IS ON]` | 1 | 2 | 1 |
| `[IS OURTEAMATTACKED]` | 2 | 5 | 5 |
| `[IS PASSIVE OBJECT]` | 1 | 4 | 4 |
| `[IS PHYSICAL DAMAGE]` | 1 | 1 | 1 |
| `[IS RELATIVE COORD]` | 1 | 4 | 4 |
| `[IS RESPAWN MONSTER]` | 1 | 1 | 1 |
| `[IS RIGHT]` | 2 | 129 | 116 |
| `[IS TARGET STATE]` | 2 | 222 | 127 |
| `[IS TARGET STATES OR]` | 1 | 1 | 1 |
| `[IS TARGETACTIVESTATUS]` | 2 | 126 | 73 |
| `[IS TEAM]` | 2 | 76 | 54 |
| `[IS UP]` | 1 | 1 | 1 |
| `[IS WATER DAMAGE]` | 2 | 26 | 22 |
| `[JUMP]` | 2 | 7 | 7 |
| `[JUMP HIGH]` | 1 | 51 | 49 |
| `[JUMP OUT]` | 2 | 219 | 102 |
| `[jump power]` | 2 | 17 | 17 |
| `[JUMP TIME]` | 1 | 51 | 49 |
| `[JUMP TO TARGET]` | 2 | 84 | 84 |
| `[JUMP TO TARGET EX]` | 1 | 51 | 49 |
| `[JUMPATTACK]` | 2 | 4 | 4 |
| `[KEEP STATE]` | 1 | 5 | 5 |
| `[KING]` | 2 | 100 | 91 |
| `[KNOCK]` | 1 | 11 | 7 |
| `[KNOCK BACK]` | 2 | 7 | 7 |
| `[KNOCK BACK PIXEL]` | 1 | 11 | 7 |
| `[KNOCK BACK TYPE]` | 2 | 18 | 14 |
| `[knuck back]` | 1 | 1 | 1 |
| `[LAST]` | 2 | 46 | 40 |
| `[LAST ACTIVE ATTACKER]` | 2 | 54 | 28 |
| `[LAST ACTIVE ATTACKSUCCESS]` | 2 | 258 | 74 |
| `[LAST ATTACKER]` | 2 | 164 | 77 |
| `[LAST ATTACKSUCCESS]` | 2 | 1725 | 702 |
| `[LAST ATTACKSUCCESSES]` | 2 | 153 | 91 |
| `[LAST TARGET PRIORITY]` | 2 | 40 | 40 |
| `[LASTATTACK POSITION]` | 2 | 36 | 12 |
| `[LAYER]` | 2 | 397 | 272 |
| `[LAYER TYPE]` | 1 | 1 | 1 |
| `[LEFT]` | 2 | 823 | 484 |
| `[LENGTH]` | 1 | 4 | 4 |
| `[LENGTH RATE]` | 1 | 32 | 31 |
| `[LEVEL]` | 2 | 27347 | 10178 |
| `[LIFE TIME]` | 2 | 254 | 230 |
| `[LIFT UP]` | 1 | 22 | 22 |
| `[light element]` | 2 | 19 | 18 |
| `[light element attack]` | 1 | 4 | 3 |
| `[lightning]` | 1 | 2 | 2 |
| `[LIMIT]` | 2 | 3138 | 2206 |
| `[LINKED OBJECT LIST]` | 1 | 9 | 8 |
| `[LOAD TARGET]` | 2 | 291 | 131 |
| `[LOCK QUEST UNTIL]` | 2 | 4 | 4 |
| `[LOOP ANI]` | 1 | 4 | 1 |
| `[LOW]` | 2 | 549 | 462 |
| `[MAGIC CIRCLE]` | 2 | 300 | 154 |
| `[MAGICAL]` | 2 | 7 | 7 |
| `[magical attack]` | 2 | 61 | 42 |
| `[magical back attack critical rate]` | 2 | 3 | 3 |
| `[magical critical hit rate]` | 2 | 12 | 12 |
| `[magical damage reduce percent]` | 1 | 20 | 19 |
| `[magical defense]` | 2 | 41 | 25 |
| `[MAGICAL SHIELD]` | 1 | 11 | 8 |
| `[MAP CHANGE SYSTEM]` | 1 | 6 | 6 |
| `[MASTER]` | 2 | 100 | 91 |
| `[MAX ROTATION]` | 1 | 1 | 1 |
| `[MAXTIME]` | 1 | 1 | 1 |
| `[ME]` | 2 | 68916 | 19836 |
| `[MESSAGE SEND]` | 1 | 4 | 2 |
| `[MESSAGE SEND ALL]` | 1 | 1 | 1 |
| `[MESSAGE SEND DELAY]` | 1 | 1 | 1 |
| `[MID]` | 1 | 2 | 2 |
| `[MIN DISTANCE]` | 2 | 79 | 77 |
| `[MIN MOVE DISTANCE]` | 2 | 12 | 12 |
| `[MIND CONTROL APPENDAGE]` | 2 | 22 | 22 |
| `[MIRROR RANGE]` | 1 | 2 | 2 |
| `[MONSTER]` | 2 | 2531 | 1802 |
| `[MONSTER ACTION COOLTIME CHANGE]` | 1 | 4 | 2 |
| `[MONSTER ACTION COOLTIME CLEAR]` | 1 | 1 | 1 |
| `[MONSTER TEAM]` | 2 | 49 | 34 |
| `[MOTION]` | 2 | 41643 | 41641 |
| `[MOVABLE POS ONLY]` | 2 | 247 | 70 |
| `[MOVE]` | 2 | 910 | 751 |
| `[MOVE ACCELATE]` | 1 | 1 | 1 |
| `[MOVE APPENDAGE]` | 2 | 5 | 5 |
| `[MOVE DIR]` | 2 | 71 | 64 |
| `[MOVE DISTANCE]` | 1 | 51 | 49 |
| `[MOVE DOWN FRAME]` | 1 | 51 | 49 |
| `[MOVE ME]` | 2 | 1078 | 879 |
| `[MOVE METHOD DASH]` | 1 | 4 | 4 |
| `[MOVE PATTERN]` | 2 | 17 | 17 |
| `[MOVE PATTERN OFF]` | 2 | 10 | 10 |
| `[MOVE REDUCE]` | 2 | 32 | 32 |
| `[move speed]` | 2 | 377 | 349 |
| `[MOVE TARGET]` | 2 | 65 | 57 |
| `[MOVE TIME]` | 1 | 9 | 9 |
| `[MOVE TO]` | 2 | 40 | 40 |
| `[MOVE TO DESTINATION]` | 1 | 4 | 4 |
| `[MOVE TO TARGET]` | 2 | 178 | 124 |
| `[MOVE TYPE]` | 1 | 202 | 119 |
| `[MOVE UNIFORM]` | 2 | 30 | 26 |
| `[MOVE UP FRAME]` | 1 | 51 | 49 |
| `[MOVEBACK]` | 2 | 59 | 59 |
| `[MP]` | 2 | 20 | 15 |
| `[mp regen rate]` | 2 | 11 | 11 |
| `[MUCU LIMIT CONTROL]` | 2 | 16 | 16 |
| `[MY CASTING GAUGE]` | 1 | 14 | 13 |
| `[MY CURRENT DIRECTION]` | 2 | 2 | 2 |
| `[MY DIRECTION]` | 2 | 85 | 64 |
| `[MY OPPOSITE DIRECTION]` | 2 | 104 | 58 |
| `[MY TEAM]` | 2 | 14 | 12 |
| `[NAME]` | 1 | 29 | 28 |
| `[NAME HIDE OFF]` | 2 | 90 | 90 |
| `[NAME HIDE ON]` | 2 | 162 | 156 |
| `[NEAR]` | 2 | 35 | 30 |
| `[NEAR BY]` | 1 | 1 | 1 |
| `[NEUTRAL]` | 2 | 686 | 167 |
| `[NEXT BEHAVIOR]` | 1 | 9 | 8 |
| `[no blood]` | 1 | 1 | 1 |
| `[NO DAMAGE MOTION]` | 1 | 2 | 2 |
| `[NO DROP]` | 1 | 4 | 4 |
| `[NO EFFECT]` | 2 | 2950 | 1214 |
| `[NO EXP]` | 1 | 4 | 4 |
| `[NO GOLD]` | 1 | 1 | 1 |
| `[non attraction]` | 1 | 85 | 68 |
| `[non holding]` | 1 | 28 | 26 |
| `[non outline]` | 1 | 1 | 1 |
| `[NONE]` | 1 | 10 | 9 |
| `[none]` | 1 | 1 | 1 |
| `[NORMAL]` | 2 | 257 | 197 |
| `[normal]` | 1 | 1 | 1 |
| `[NOT BACK]` | 2 | 7 | 7 |
| `[NOT CHECK COUNTER HIT INCORRECT FRAME]` | 1 | 24 | 24 |
| `[NOT HAVE FOLLOWING OBJECT]` | 1 | 39 | 14 |
| `[NOT NEAR BY]` | 1 | 1 | 1 |
| `[NOT USE DIRECTION]` | 2 | 42 | 18 |
| `[NOT USE OBJECT DIRECTION]` | 2 | 87 | 61 |
| `[NOT USE OBJECT ZPOS]` | 2 | 122 | 99 |
| `[NOTICE]` | 1 | 70 | 66 |
| `[NOTICE_BG]` | 1 | 2 | 2 |
| `[NOW]` | 2 | 9292 | 6706 |
| `[OBJECT SCALE]` | 1 | 2 | 2 |
| `[OBJECT SCALE EX]` | 1 | 10 | 2 |
| `[OCULAR SPECTRUM]` | 1 | 1 | 1 |
| `[OCULAR SPECTRUM DATA]` | 1 | 1 | 1 |
| `[OFF]` | 2 | 10257 | 3209 |
| `[OFFSET]` | 1 | 213 | 120 |
| `[OFFSET POS]` | 2 | 80 | 77 |
| `[ON]` | 2 | 7114 | 3151 |
| `[ON ATTACKSUCCESS]` | 2 | 1946 | 1764 |
| `[ON CHANGE LIFE]` | 2 | 10 | 10 |
| `[ON COUNTER HIT]` | 1 | 44 | 34 |
| `[ON CREATE OBJECT]` | 2 | 14 | 14 |
| `[ON DAMAGE]` | 2 | 934 | 706 |
| `[ON DESTROY ME]` | 1 | 1 | 1 |
| `[ON DESTROY OBJECT]` | 2 | 38 | 36 |
| `[ON END ACTION]` | 1 | 357 | 320 |
| `[ON END ANIMATION]` | 1 | 11 | 11 |
| `[ON END BEHAVIOR]` | 2 | 39 | 39 |
| `[ON MESSAGE]` | 1 | 3 | 2 |
| `[ON MOVE COLLISION]` | 2 | 31 | 30 |
| `[ON REMOVE ACTION]` | 1 | 5 | 5 |
| `[ON SET ACTION]` | 2 | 4276 | 3535 |
| `[ON SHAKE INPUT]` | 1 | 1 | 1 |
| `[ON START MAP]` | 1 | 1 | 1 |
| `[ONESIDE MOVE]` | 1 | 1 | 1 |
| `[ONLY FIRST TIME]` | 1 | 20 | 10 |
| `[OTHER MAP VISIBLE OFF]` | 1 | 4 | 1 |
| `[OVERTURN]` | 2 | 93 | 89 |
| `[OZMA APC]` | 1 | 2 | 2 |
| `[OZMA CAMERA]` | 1 | 9 | 8 |
| `[PARABOLA]` | 1 | 4 | 4 |
| `[PARABOLA ACCEL]` | 1 | 14 | 7 |
| `[PARAM]` | 1 | 3 | 3 |
| `[PARENT MAP ONLY]` | 1 | 31 | 28 |
| `[PARENT OFFSET]` | 1 | 14 | 13 |
| `[PARTICLE]` | 2 | 2471 | 901 |
| `[PARTICLE EMITTER]` | 1 | 9 | 2 |
| `[PARTICLE FILENAME]` | 2 | 25801 | 9641 |
| `[PARTY TARGET]` | 2 | 266 | 83 |
| `[PASSIVE]` | 2 | 4057 | 2312 |
| `[PASSIVE INDEX]` | 1 | 4 | 4 |
| `[PASSIVE OBJECT]` | 2 | 45 | 23 |
| `[PASSIVE OBJECT INDEX]` | 1 | 8 | 1 |
| `[PATTERN]` | 2 | 6 | 6 |
| `[PAUSE ACTION CHARACTER]` | 1 | 6 | 6 |
| `[physic]` | 1 | 1 | 1 |
| `[PHYSICAL]` | 2 | 7 | 7 |
| `[physical absolute damage]` | 1 | 1 | 1 |
| `[physical absolute defense]` | 2 | 8 | 8 |
| `[physical attack]` | 2 | 74 | 55 |
| `[physical attack bonus]` | 2 | 8 | 8 |
| `[physical back attack critical rate]` | 1 | 1 | 1 |
| `[physical critical hit rate]` | 2 | 14 | 14 |
| `[physical damage reduce percent]` | 1 | 20 | 19 |
| `[physical defense]` | 2 | 60 | 44 |
| `[PHYSICAL SHIELD]` | 1 | 1 | 1 |
| `[PLAY]` | 1 | 2 | 2 |
| `[PLAY ANIMATION]` | 1 | 90 | 53 |
| `[PLAY SOUND]` | 2 | 291 | 162 |
| `[PLAY SOUND ID]` | 1 | 2 | 1 |
| `[PLAYER]` | 2 | 849 | 529 |
| `[POINT]` | 2 | 239 | 162 |
| `[poison]` | 2 | 66 | 46 |
| `[PONIT]` | 1 | 3 | 1 |
| `[POS]` | 2 | 29080 | 10710 |
| `[POSITION TYPE]` | 1 | 13 | 11 |
| `[PROC]` | 2 | 797 | 333 |
| `[PULL APPENDAGE]` | 2 | 73 | 71 |
| `[PULL APPENDAGE EX]` | 2 | 72 | 70 |
| `[PUSH ASIDE]` | 1 | 22 | 22 |
| `[push aside]` | 1 | 1 | 1 |
| `[PUSH DUST INDEX]` | 1 | 23 | 22 |
| `[PUSH MOTION]` | 1 | 23 | 22 |
| `[PUSH MOTION DELAY TIME]` | 1 | 23 | 22 |
| `[PUSH MOTION TIME]` | 1 | 23 | 22 |
| `[PUSH TIME]` | 1 | 23 | 22 |
| `[PUSH VELOCITY]` | 1 | 23 | 22 |
| `[PUSH VELOCITY Y]` | 1 | 16 | 15 |
| `[RADIUS]` | 1 | 4 | 3 |
| `[RAID SET SYMBOL]` | 1 | 3 | 3 |
| `[RANDOM]` | 2 | 9120 | 1893 |
| `[RANDOM CHECK]` | 2 | 45 | 45 |
| `[RANDOM GENERATE PASSIVE OBJECT]` | 1 | 8 | 1 |
| `[RANDOM HALF]` | 1 | 6 | 6 |
| `[RANDOM SELECT]` | 2 | 3131 | 1583 |
| `[RANGE]` | 2 | 93 | 58 |
| `[REALDUNGEON CHECKUP]` | 2 | 12 | 2 |
| `[REDUCE DAMAGE]` | 1 | 10 | 4 |
| `[REFLECTBUFF APPENDAGE]` | 2 | 38 | 6 |
| `[REFRESH MOVEINFO]` | 1 | 3 | 3 |
| `[RELEASE RIDABLE OBJECT]` | 1 | 1 | 1 |
| `[REMOVE]` | 1 | 1 | 1 |
| `[REMOVE ACTIVE STATUS]` | 2 | 118 | 23 |
| `[REMOVE APPENDAGE]` | 2 | 18 | 15 |
| `[REMOVE CATEGORY]` | 2 | 569 | 505 |
| `[REMOVE CHAIN LINE APPENDAGE]` | 1 | 12 | 11 |
| `[REMOVE FINAL DAMAGE RATE APPENDAGE]` | 1 | 3 | 3 |
| `[REMOVE LAYER]` | 2 | 138 | 48 |
| `[REMOVE VIRTUALHP]` | 2 | 15 | 15 |
| `[RESET]` | 2 | 2777 | 1999 |
| `[RESET ROSSALL SOUND APPENDAGE]` | 1 | 1 | 1 |
| `[RESIST ACTION]` | 1 | 4 | 2 |
| `[RESOLUTION APPENDAGE]` | 2 | 32 | 27 |
| `[RESTART COOLTIME]` | 2 | 53 | 34 |
| `[RESTORE]` | 2 | 738 | 592 |
| `[RESTORE TARGET]` | 2 | 11 | 11 |
| `[REVERSE]` | 2 | 230 | 212 |
| `[REVERSE DIRECTION]` | 2 | 12 | 12 |
| `[REVERSE GAUGE]` | 1 | 9 | 9 |
| `[REVERSE HP]` | 1 | 1 | 1 |
| `[RGB CHANGE TIME]` | 1 | 1 | 1 |
| `[RGBA]` | 2 | 214 | 168 |
| `[RIGHT]` | 2 | 1847 | 695 |
| `[RIGIDITY]` | 2 | 18 | 14 |
| `[ROTATE]` | 1 | 52 | 48 |
| `[ROTATION]` | 1 | 3 | 3 |
| `[ROTERS BACKGROUND DOWN]` | 1 | 1 | 1 |
| `[ROTERS BACKGROUND UP]` | 1 | 2 | 2 |
| `[ROW]` | 1 | 3 | 3 |
| `[RPM]` | 1 | 4 | 3 |
| `[RSSET]` | 2 | 2 | 2 |
| `[SAVE POSITION]` | 1 | 1 | 1 |
| `[SAVE TARGET OBJECT]` | 2 | 164 | 150 |
| `[SAY SPEECH]` | 2 | 995 | 751 |
| `[SAY SPEECH WITH POSITION]` | 2 | 179 | 115 |
| `[SCALE]` | 1 | 38 | 22 |
| `[SCALE PERCENT]` | 1 | 62 | 46 |
| `[SCENE TRANSITION SCREEN EFFECT]` | 1 | 1 | 1 |
| `[SCREEN EFFECT]` | 1 | 3 | 3 |
| `[SCREEN GAUGE]` | 1 | 12 | 11 |
| `[SEND DO BEHAVIOR]` | 2 | 46 | 42 |
| `[SEND MESSAGE]` | 2 | 171 | 163 |
| `[SET ABSOLUTE SUPER ARMOR]` | 1 | 74 | 54 |
| `[SET ACTION]` | 2 | 10776 | 7938 |
| `[SET ALL SKILL ENABLE]` | 1 | 2 | 2 |
| `[SET ALPHA]` | 2 | 10 | 10 |
| `[SET BGM]` | 1 | 1 | 1 |
| `[SET CASTING GAUGEPOS]` | 1 | 6 | 6 |
| `[SET COLOR]` | 2 | 36 | 36 |
| `[SET COLOR KEY]` | 1 | 39 | 39 |
| `[SET DAMAGE BOX]` | 2 | 282 | 226 |
| `[SET DAMAGE CHECK]` | 2 | 21 | 17 |
| `[SET DIRECTION]` | 2 | 3204 | 2678 |
| `[SET DIRECTION TO CHECKUP]` | 1 | 9 | 6 |
| `[SET FIX DIRECTION]` | 1 | 5 | 5 |
| `[SET FLYING MARK]` | 1 | 3 | 3 |
| `[SET FRAME]` | 2 | 1149 | 978 |
| `[SET GRABABLE]` | 2 | 210 | 190 |
| `[SET HOLD DAMAGEANI]` | 2 | 9 | 9 |
| `[SET HOLD DOWNANI]` | 2 | 27 | 18 |
| `[SET HP]` | 2 | 179 | 169 |
| `[SET HP DESTROY]` | 1 | 1 | 1 |
| `[SET MONSTER FACE IMAGE]` | 1 | 1 | 1 |
| `[SET MOVE PARENT]` | 1 | 3 | 3 |
| `[SET MOVEVELS]` | 2 | 10 | 8 |
| `[SET OUTLINE]` | 2 | 122 | 48 |
| `[SET OVERTURN]` | 2 | 68 | 30 |
| `[SET PARTY SYMBOL]` | 2 | 25 | 11 |
| `[SET PARTY TARGET]` | 2 | 47 | 23 |
| `[SET POS FORCE]` | 2 | 571 | 332 |
| `[SET POSITION CASTING GAUGE]` | 2 | 54 | 32 |
| `[SET POSITION HP GAUGE]` | 1 | 2 | 1 |
| `[SET POSITION NAME]` | 1 | 3 | 3 |
| `[SET RANDOM TARGET]` | 2 | 4 | 4 |
| `[SET RESIST]` | 1 | 1 | 1 |
| `[SET REVOLUTION]` | 1 | 4 | 3 |
| `[SET SAVED TARGET]` | 2 | 37 | 37 |
| `[SET SPEED]` | 2 | 10500 | 4786 |
| `[SET SPEED MULTIPLE CONTROL]` | 1 | 1 | 1 |
| `[SET SUBANIMATION COLOR]` | 1 | 11 | 11 |
| `[SET SYMBOL]` | 2 | 59 | 54 |
| `[SET TARGET]` | 1 | 17 | 17 |
| `[SET TARGET FRAME]` | 1 | 40 | 2 |
| `[SET TEAM]` | 2 | 32 | 28 |
| `[SET TOP PARENT]` | 1 | 76 | 15 |
| `[SET UNBEATABLE]` | 2 | 5 | 5 |
| `[SET USE REVOLUTION]` | 1 | 4 | 3 |
| `[SET VISIBLITY]` | 2 | 39 | 34 |
| `[SET WHOLE ALPHA]` | 2 | 18 | 18 |
| `[SET WHOLE DAMAGETYPE]` | 2 | 88 | 67 |
| `[SET WIDTH]` | 2 | 4 | 2 |
| `[SET X SPEED]` | 1 | 203 | 53 |
| `[SET Y SPEED]` | 1 | 3 | 3 |
| `[SET Z SPEED]` | 1 | 3 | 2 |
| `[SHAKE INPUT]` | 1 | 2 | 1 |
| `[SHAKING]` | 2 | 2909 | 2271 |
| `[SHAKING GAGE]` | 2 | 4 | 4 |
| `[SHORT KNOCK BACK]` | 1 | 3 | 3 |
| `[SHOW HITGAUGE]` | 1 | 4 | 4 |
| `[SIT]` | 2 | 193 | 173 |
| `[SLAYER]` | 1 | 90 | 81 |
| `[sleep]` | 1 | 7 | 7 |
| `[slow]` | 2 | 30 | 20 |
| `[SLOW MOTION AT DAMAGED SUPER ARMOR ON]` | 1 | 40 | 40 |
| `[SOUND]` | 2 | 13142 | 13140 |
| `[SOUND EX]` | 1 | 61 | 61 |
| `[SOUND PROBABILITY]` | 2 | 102 | 102 |
| `[SOURCE]` | 1 | 1 | 1 |
| `[SPEECH]` | 2 | 5140 | 5128 |
| `[SPEECH POS]` | 2 | 36 | 36 |
| `[SPEED]` | 2 | 84 | 81 |
| `[STAND]` | 2 | 1098 | 1023 |
| `[START ANGLE]` | 1 | 4 | 3 |
| `[START ANI]` | 1 | 4 | 1 |
| `[START EFFECT LEVEL]` | 1 | 1 | 1 |
| `[START KEYSTROKE MODE]` | 2 | 32 | 32 |
| `[START POSITION]` | 2 | 71 | 64 |
| `[START RGBA]` | 1 | 1 | 1 |
| `[START X]` | 1 | 4 | 4 |
| `[START Y]` | 1 | 4 | 4 |
| `[STATE]` | 2 | 39 | 30 |
| `[STAUTS OF MAP CHANGE SYSTEM]` | 1 | 19 | 9 |
| `[STAY]` | 2 | 803 | 684 |
| `[STAY TIME]` | 2 | 12 | 12 |
| `[stone]` | 2 | 23 | 19 |
| `[STOP DUNGEON ZOOM IN]` | 1 | 9 | 9 |
| `[STOP DUNGEON ZOOM OUT]` | 1 | 9 | 9 |
| `[STOP MOVE UNABLE POS]` | 1 | 3 | 3 |
| `[STRAIGHT HOMING]` | 1 | 1 | 1 |
| `[STRAIGHT HOMING Y AXIS REVISION]` | 1 | 1 | 1 |
| `[stuck]` | 2 | 58 | 30 |
| `[stun]` | 2 | 75 | 71 |
| `[SUB ANI]` | 2 | 19967 | 19960 |
| `[SUB ANI FLAG]` | 1 | 18 | 3 |
| `[SUB ANI WITH XY]` | 2 | 4 | 4 |
| `[SUB ANI WITH XYZ]` | 2 | 66 | 66 |
| `[SUB ANIMATION INDICES]` | 1 | 11 | 11 |
| `[SUFFOCATION APPENDAGE]` | 1 | 4 | 2 |
| `[SUMMON APC]` | 2 | 6 | 4 |
| `[SUMMON MARK]` | 2 | 231 | 113 |
| `[SUMMON MASTER]` | 2 | 83 | 56 |
| `[SUMMON MASTER COPY]` | 1 | 10 | 9 |
| `[SUMMON MONSTER]` | 2 | 1538 | 740 |
| `[SUMMON OBJECT]` | 1 | 39 | 31 |
| `[SUMMON TIME]` | 2 | 232 | 85 |
| `[SUMMON TYPE]` | 1 | 5 | 5 |
| `[SUPER ARMOR]` | 1 | 6 | 6 |
| `[SUPER DAMAGE]` | 1 | 23 | 22 |
| `[SUPER DOWN]` | 1 | 22 | 22 |
| `[SYNC ANIMATION ROTATION]` | 1 | 1 | 1 |
| `[SYNC TARGET MOVE]` | 1 | 1 | 1 |
| `[TARGET]` | 2 | 1628 | 588 |
| `[TARGET CASTING]` | 1 | 14 | 13 |
| `[TARGET CASTING CANCEL]` | 1 | 17 | 8 |
| `[TARGET CASTING TIME]` | 1 | 1 | 1 |
| `[TARGET DISTANCE]` | 1 | 26 | 25 |
| `[TARGET EXTEND CIRCLE]` | 1 | 5 | 1 |
| `[TARGET OFFSET]` | 1 | 17 | 16 |
| `[TARGET VELOCITY REGION]` | 1 | 4 | 4 |
| `[TEAM]` | 2 | 340 | 141 |
| `[TELEKINESIS APPENDAGE]` | 2 | 24 | 8 |
| `[TELEPORT]` | 2 | 1471 | 1070 |
| `[THORNS APPENDAGE]` | 2 | 2 | 2 |
| `[THROWING SPEED]` | 2 | 22 | 22 |
| `[TIME]` | 2 | 121 | 96 |
| `[TIME CHANGE APPENDAGE]` | 1 | 8 | 6 |
| `[TIME VALUE]` | 2 | 218 | 172 |
| `[TO BEFORE]` | 1 | 2 | 2 |
| `[TO SAVE TARGET]` | 1 | 3 | 3 |
| `[TO TARGET]` | 2 | 2063 | 1828 |
| `[TRANSITION OPTION]` | 1 | 1 | 1 |
| `[TRIGGER]` | 2 | 81878 | 21185 |
| `[TRIGGER CHECK]` | 2 | 545 | 228 |
| `[TRIGGER QUESTEVENT]` | 2 | 16 | 16 |
| `[TYPE]` | 2 | 31 | 31 |
| `[UNIFORM]` | 1 | 43 | 32 |
| `[UNINTERRUPTIBLE]` | 1 | 177 | 177 |
| `[UNLOCK QUEST]` | 2 | 4 | 4 |
| `[UP]` | 2 | 136 | 63 |
| `[UPDATE VAR]` | 1 | 50 | 19 |
| `[USE ANGLE]` | 2 | 71 | 30 |
| `[USE DUNGEON MOVABLE RATE]` | 1 | 46 | 10 |
| `[USE EFFECT]` | 2 | 80 | 64 |
| `[USE MAP POS]` | 2 | 4965 | 1353 |
| `[USE MAP ZPOS]` | 1 | 4 | 1 |
| `[USE MaY DIRECTION]` | 2 | 2 | 2 |
| `[USE ME X POSITION]` | 1 | 44 | 23 |
| `[USE MONOCHROME]` | 1 | 1 | 1 |
| `[USE MY BASE POS]` | 1 | 7 | 7 |
| `[USE MY BASEPOS]` | 2 | 2470 | 1227 |
| `[USE MY DIRECTION]` | 2 | 6779 | 2965 |
| `[USE MY DIRECTION BASE]` | 1 | 179 | 104 |
| `[USE MY POS]` | 1 | 34 | 15 |
| `[USE MY TEAM]` | 2 | 16 | 16 |
| `[USE NEUTRAL TEAM]` | 2 | 11 | 9 |
| `[USE NEXT ACTION]` | 1 | 1 | 1 |
| `[USE OBJECT ZPOS]` | 2 | 1263 | 689 |
| `[USE ORI POS]` | 1 | 2 | 2 |
| `[USE PARENT ACTION]` | 1 | 1 | 1 |
| `[USE PARENT BASEPOS]` | 1 | 9 | 8 |
| `[USE PARENT DIRECTION]` | 1 | 9 | 8 |
| `[USE RANDOM POS]` | 1 | 4 | 4 |
| `[USE REVOLUTION]` | 1 | 5 | 4 |
| `[USE TARGET]` | 2 | 84 | 81 |
| `[USE TARGET BASEPOS]` | 1 | 4 | 3 |
| `[USE TARGET POS]` | 2 | 66 | 63 |
| `[USE TARGET POS LIMITED]` | 1 | 25 | 25 |
| `[USE TARGET POS UNLIMITED]` | 1 | 2 | 2 |
| `[USE TARGET TEAM]` | 2 | 68 | 24 |
| `[USE ZPOS OFFSET]` | 1 | 81 | 36 |
| `[USE ZPOS ZERO]` | 1 | 133 | 73 |
| `[VALIDTIME]` | 2 | 84 | 81 |
| `[VALUE]` | 1 | 1 | 1 |
| `[VELOCITY]` | 2 | 14 | 14 |
| `[VIRTUALHP APPENDAGE]` | 2 | 59 | 34 |
| `[WARNING MARK]` | 2 | 2629 | 643 |
| `[water element]` | 2 | 25 | 25 |
| `[water element attack]` | 2 | 4 | 4 |
| `[weapon break]` | 1 | 7 | 7 |
| `[WHICH]` | 2 | 16292 | 7734 |
| `[WIND APPENDAGE]` | 2 | 62 | 35 |
| `[WITHIN SIGHT]` | 2 | 14 | 12 |
| `[WITHOUT SUMMONER DIE]` | 1 | 5 | 5 |
| `[X AXIS]` | 2 | 9201 | 4250 |
| `[X END]` | 2 | 65 | 60 |
| `[X NORMAL]` | 2 | 10 | 8 |
| `[X SLANT]` | 2 | 6 | 6 |
| `[X START]` | 2 | 563 | 329 |
| `[XPOS]` | 1 | 7 | 4 |
| `[Y AXIS]` | 2 | 2084 | 1007 |
| `[Y AXIS RATE]` | 1 | 11 | 6 |
| `[Y END]` | 2 | 28 | 23 |
| `[Y NORMAL]` | 2 | 4 | 4 |
| `[Y SCALE]` | 1 | 32 | 31 |
| `[Y SLANT]` | 2 | 4 | 4 |
| `[Y START]` | 2 | 539 | 311 |
| `[Z AXIS]` | 2 | 3304 | 1641 |
| `[Z END]` | 2 | 26 | 25 |
| `[Z OFFSET]` | 1 | 18 | 18 |
| `[Z START]` | 2 | 529 | 313 |
| `[ZOOM IN AFTER MOVE]` | 1 | 9 | 9 |
| `[ZOOM IT]` | 2 | 72 | 53 |
| `[ZOOM IT PLUS]` | 1 | 9 | 9 |
| `[ZOOM IT PLUS OUT]` | 1 | 2 | 2 |
| `[ZOOM OUT]` | 1 | 1 | 1 |
| `[ZOOM OUT BEFORE MOVE]` | 1 | 9 | 9 |
| `[ZOOM OUT MAINTAIN FOCUS]` | 1 | 2 | 2 |
| `[ZOOM RATE]` | 1 | 9 | 9 |
| `[ZOOM TIME]` | 1 | 9 | 9 |
| `[ZPOS]` | 2 | 1013 | 753 |
| `[ZSPEED]` | 2 | 42 | 40 |

## 闭合标签统计表

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[/ACTION INDICES]` | 1 | 5 | 2 |
| `[/ADD ANI TO OBJECT]` | 1 | 2 | 1 |
| `[/ADD ANIMATION EX]` | 1 | 120 | 62 |
| `[/ADD APPENDAGE]` | 1 | 7 | 7 |
| `[/APPENDAGE]` | 2 | 787 | 728 |
| `[/ARG VAR]` | 1 | 60 | 12 |
| `[/BEHAVIOR]` | 2 | 66628 | 21170 |
| `[/CASTING]` | 2 | 268 | 238 |
| `[/CASTING EX]` | 2 | 149 | 147 |
| `[/CHAIN LINE APPENDAGE]` | 1 | 32 | 31 |
| `[/CHANGE MAP]` | 1 | 2 | 2 |
| `[/CHARACTERISTIC]` | 1 | 14 | 14 |
| `[/CHECK PLAYER NUM]` | 1 | 35 | 6 |
| `[/CHECKUP]` | 2 | 11544 | 6153 |
| `[/COLOR CHANGE EFFECT]` | 2 | 266 | 241 |
| `[/COUNTER HIT INFO]` | 1 | 44 | 34 |
| `[/CREATE PASSIVEOBJECT]` | 2 | 25801 | 9641 |
| `[/CREATE PASSIVEOBJECT CIRCLE]` | 1 | 22 | 11 |
| `[/CUSTOM ID UI CREATE]` | 1 | 4 | 1 |
| `[/CUT SCENE]` | 2 | 71 | 64 |
| `[/DAMAGE]` | 2 | 25 | 21 |
| `[/DELETE APPENDAGE]` | 2 | 94 | 78 |
| `[/DIM]` | 2 | 3202 | 1639 |
| `[/DRAW UI LAYER ANIMATION]` | 1 | 2 | 2 |
| `[/DUNGEON INDEX]` | 1 | 3 | 2 |
| `[/DUNGEON NOT INDEX]` | 1 | 3 | 2 |
| `[/EX GAUGE MODE]` | 1 | 12 | 11 |
| `[/FLASH SCREEN]` | 2 | 214 | 168 |
| `[/FRAME]` | 1 | 44 | 34 |
| `[/FRAME SET]` | 1 | 24 | 17 |
| `[/GET OUT]` | 1 | 4 | 4 |
| `[/GRAB OFF]` | 2 | 27 | 27 |
| `[/GRAB ON]` | 1 | 19 | 19 |
| `[/GUARD APPENDAGE]` | 2 | 7 | 7 |
| `[/HOMING TO CHECKUP OBJECT]` | 1 | 1 | 1 |
| `[/HP APPENDAGE]` | 2 | 28 | 28 |
| `[/IF]` | 2 | 3244 | 1605 |
| `[/IMMUNE ACTIVE STATUS]` | 1 | 12 | 12 |
| `[/IMMUNE INACTIVE STATUS]` | 1 | 1 | 1 |
| `[/IMPROVED INVINCIBLE]` | 1 | 2 | 1 |
| `[/INDEX]` | 2 | 4 | 3 |
| `[/INTERPOLATION MOVE TARGET]` | 1 | 202 | 119 |
| `[/IS BLOSSOM APPENDAGE STATE]` | 1 | 12 | 3 |
| `[/IS CATEGORY]` | 2 | 4 | 4 |
| `[/IS IDEX]` | 1 | 2 | 2 |
| `[/IS IN AREA]` | 2 | 93 | 58 |
| `[/IS IN POINT AREA]` | 2 | 5 | 4 |
| `[/IS INDEX]` | 2 | 6401 | 3624 |
| `[/IS NON TARGETED]` | 1 | 2 | 1 |
| `[/IS NOT INDEX]` | 2 | 467 | 43 |
| `[/IS NOT TARGET STATE]` | 1 | 19 | 19 |
| `[/IS OBJECT TYPE]` | 2 | 1019 | 708 |
| `[/IS TARGET STATE]` | 1 | 2 | 1 |
| `[/IS TARGET STATES OR]` | 1 | 1 | 1 |
| `[/IS TARGETACTIVESTATUS]` | 1 | 10 | 6 |
| `[/IS TEAM]` | 2 | 67 | 45 |
| `[/ISNDEX]` | 2 | 2 | 2 |
| `[/JUMP TO TARGET EX]` | 1 | 51 | 49 |
| `[/LINKED OBJECT LIST]` | 1 | 9 | 8 |
| `[/MAP CHANGE SYSTEM]` | 1 | 6 | 6 |
| `[/MONSTER ACTION COOLTIME CHANGE]` | 1 | 4 | 2 |
| `[/MONSTER ACTION COOLTIME CLEAR]` | 1 | 1 | 1 |
| `[/MOTION]` | 2 | 41643 | 41638 |
| `[/MOVE DIR]` | 2 | 71 | 64 |
| `[/MOVE PATTERN]` | 2 | 17 | 17 |
| `[/MOVE TO DESTINATION]` | 1 | 4 | 4 |
| `[/NEAR BY]` | 1 | 1 | 1 |
| `[/NOT NEAR BY]` | 1 | 1 | 1 |
| `[/NOTICE]` | 1 | 72 | 68 |
| `[/NOTICE_BG]` | 1 | 2 | 2 |
| `[/OCULAR SPECTRUM]` | 1 | 1 | 1 |
| `[/OCULAR SPECTRUM DATA]` | 1 | 1 | 1 |
| `[/PARAM]` | 1 | 3 | 3 |
| `[/PARTY TARGET]` | 2 | 266 | 83 |
| `[/PASSIVE OBJECT INDEX]` | 1 | 8 | 1 |
| `[/PLAY ANIMATION]` | 1 | 90 | 53 |
| `[/PULL APPENDAGE]` | 1 | 12 | 11 |
| `[/PULL APPENDAGE EX]` | 2 | 72 | 70 |
| `[/RANDOM]` | 2 | 8 | 4 |
| `[/RANDOM GENERATE PASSIVE OBJECT]` | 1 | 8 | 1 |
| `[/RANDOM SELECT]` | 2 | 3118 | 1577 |
| `[/RANDOM SET]` | 1 | 2 | 2 |
| `[/REMOVE APPENDAGE]` | 1 | 1 | 1 |
| `[/SCENE TRANSITION SCREEN EFFECT]` | 1 | 1 | 1 |
| `[/SCREEN EFFECT]` | 1 | 3 | 3 |
| `[/SET BGM]` | 1 | 1 | 1 |
| `[/SET MOVEVELS]` | 2 | 10 | 8 |
| `[/SET POS FORCE]` | 2 | 571 | 332 |
| `[/SET REVOLUTION]` | 1 | 4 | 3 |
| `[/SET SPEED]` | 2 | 10497 | 4786 |
| `[/SET SPEED MULTIPLE CONTROL]` | 1 | 1 | 1 |
| `[/SET SUBANIMATION COLOR]` | 1 | 11 | 11 |
| `[/SHOW HITGAUGE]` | 1 | 4 | 4 |
| `[/SOUND]` | 2 | 13134 | 13133 |
| `[/SOUND EX]` | 1 | 61 | 61 |
| `[/SOUND PROBABILITY]` | 2 | 102 | 102 |
| `[/SPEECH]` | 2 | 5134 | 5122 |
| `[/SPEECH POS]` | 2 | 36 | 36 |
| `[/START KEYSTROKE MODE]` | 2 | 18 | 18 |
| `[/SUB ANI]` | 2 | 19957 | 19956 |
| `[/SUB ANI WITH XY]` | 2 | 4 | 4 |
| `[/SUB ANI WITH XYZ]` | 2 | 66 | 66 |
| `[/SUB ANIMATION INDICES]` | 1 | 11 | 11 |
| `[/SUFFOCATION APPENDAGE]` | 1 | 2 | 2 |
| `[/SUMMON APC]` | 2 | 6 | 4 |
| `[/SUMMON MONSTER]` | 2 | 1538 | 740 |
| `[/SUPER DAMAGE]` | 1 | 23 | 22 |
| `[/SUPER DOWN]` | 1 | 22 | 22 |
| `[/TARGET CASTING]` | 1 | 14 | 13 |
| `[/TARGET EXTEND CIRCLE]` | 1 | 5 | 1 |
| `[/TARGET VELOCITY REGION]` | 1 | 4 | 4 |
| `[/TEAM]` | 2 | 9 | 9 |
| `[/TELEPORT]` | 2 | 1471 | 1070 |
| `[/TIRGGER]` | 2 | 4 | 4 |
| `[/TRIGGER]` | 2 | 68939 | 21164 |
| `[/UPDATE VAR]` | 1 | 22 | 13 |
| `[/ZOOM IT PLUS]` | 1 | 9 | 9 |

