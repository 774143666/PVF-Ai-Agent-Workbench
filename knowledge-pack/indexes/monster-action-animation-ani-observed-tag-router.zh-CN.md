# Monster .ani 标签覆盖路由

状态：需验证

本文件覆盖目标 PVF 中 monster 动作链相关 `.ani` 观察到的字段标签。`.ani` 当前未观察到闭合标签或反引号 token。覆盖表示“已观察到并有路由”，不表示动画资源、命中、伤害或受击表现已经验证。

## 覆盖统计

- 字段标签：1145 / 1145。
- 闭合标签：0 / 0。
- 反引号 token：0 / 0。
- 未覆盖字段标签：0。
- 未覆盖闭合标签：0。
- 未覆盖反引号 token：0。
- 二进制 ANI 反编译风险：6 个文件在一个目标集中未能展开文本标签。

## 主要路由

- 帧与图像：优先核 `[FRAME MAX]`、`[FRAME000]`、`[IMAGE]`、`[IMAGE POS]`、`[DELAY]`、`[LOOP]`。
- 图像变换：`[RGBA]`、`[IMAGE RATE]`、`[IMAGE ROTATE]`、`[GRAPHIC EFFECT]` 只证明动画文本结构存在。
- 盒相关：`[ATTACK BOX]` 和 `[DAMAGE BOX]` 是盒相关入口，但必须回到动作、攻击信息和实机表现验证。
- 反编译风险：如果二进制 ANI 无法展开，不要编造标签；标为需复核。

## 全量字段标签

`[ATTACK BOX]`, `[CLIP]`, `[COORD]`, `[DAMAGE BOX]`, `[DAMAGE TYPE]`, `[DELAY]`, `[FLIP TYPE]`, `[FRAME MAX]`, `[FRAME000]`, `[FRAME001]`。

`[FRAME002]`, `[FRAME003]`, `[FRAME004]`, `[FRAME005]`, `[FRAME006]`, `[FRAME007]`, `[FRAME008]`, `[FRAME009]`, `[FRAME010]`, `[FRAME011]`。

`[FRAME012]`, `[FRAME013]`, `[FRAME014]`, `[FRAME015]`, `[FRAME016]`, `[FRAME017]`, `[FRAME018]`, `[FRAME019]`, `[FRAME020]`, `[FRAME021]`。

`[FRAME022]`, `[FRAME023]`, `[FRAME024]`, `[FRAME025]`, `[FRAME026]`, `[FRAME027]`, `[FRAME028]`, `[FRAME029]`, `[FRAME030]`, `[FRAME031]`。

`[FRAME032]`, `[FRAME033]`, `[FRAME034]`, `[FRAME035]`, `[FRAME036]`, `[FRAME037]`, `[FRAME038]`, `[FRAME039]`, `[FRAME040]`, `[FRAME041]`。

`[FRAME042]`, `[FRAME043]`, `[FRAME044]`, `[FRAME045]`, `[FRAME046]`, `[FRAME047]`, `[FRAME048]`, `[FRAME049]`, `[FRAME050]`, `[FRAME051]`。

`[FRAME052]`, `[FRAME053]`, `[FRAME054]`, `[FRAME055]`, `[FRAME056]`, `[FRAME057]`, `[FRAME058]`, `[FRAME059]`, `[FRAME060]`, `[FRAME061]`。

`[FRAME062]`, `[FRAME063]`, `[FRAME064]`, `[FRAME065]`, `[FRAME066]`, `[FRAME067]`, `[FRAME068]`, `[FRAME069]`, `[FRAME070]`, `[FRAME071]`。

`[FRAME072]`, `[FRAME073]`, `[FRAME074]`, `[FRAME075]`, `[FRAME076]`, `[FRAME077]`, `[FRAME078]`, `[FRAME079]`, `[FRAME080]`, `[FRAME081]`。

`[FRAME082]`, `[FRAME083]`, `[FRAME084]`, `[FRAME085]`, `[FRAME086]`, `[FRAME087]`, `[FRAME088]`, `[FRAME089]`, `[FRAME090]`, `[FRAME091]`。

`[FRAME092]`, `[FRAME093]`, `[FRAME094]`, `[FRAME095]`, `[FRAME096]`, `[FRAME097]`, `[FRAME098]`, `[FRAME099]`, `[FRAME100]`, `[FRAME101]`。

`[FRAME102]`, `[FRAME103]`, `[FRAME104]`, `[FRAME105]`, `[FRAME106]`, `[FRAME107]`, `[FRAME108]`, `[FRAME109]`, `[FRAME110]`, `[FRAME111]`。

`[FRAME112]`, `[FRAME113]`, `[FRAME114]`, `[FRAME115]`, `[FRAME116]`, `[FRAME117]`, `[FRAME118]`, `[FRAME119]`, `[FRAME120]`, `[FRAME121]`。

`[FRAME122]`, `[FRAME123]`, `[FRAME124]`, `[FRAME125]`, `[FRAME126]`, `[FRAME127]`, `[FRAME128]`, `[FRAME129]`, `[FRAME130]`, `[FRAME131]`。

`[FRAME132]`, `[FRAME133]`, `[FRAME134]`, `[FRAME135]`, `[FRAME136]`, `[FRAME137]`, `[FRAME138]`, `[FRAME139]`, `[FRAME140]`, `[FRAME141]`。

`[FRAME142]`, `[FRAME143]`, `[FRAME144]`, `[FRAME145]`, `[FRAME146]`, `[FRAME147]`, `[FRAME148]`, `[FRAME149]`, `[FRAME150]`, `[FRAME151]`。

`[FRAME152]`, `[FRAME153]`, `[FRAME154]`, `[FRAME155]`, `[FRAME156]`, `[FRAME157]`, `[FRAME158]`, `[FRAME159]`, `[FRAME160]`, `[FRAME161]`。

`[FRAME162]`, `[FRAME163]`, `[FRAME164]`, `[FRAME165]`, `[FRAME166]`, `[FRAME167]`, `[FRAME168]`, `[FRAME169]`, `[FRAME170]`, `[FRAME171]`。

`[FRAME172]`, `[FRAME173]`, `[FRAME174]`, `[FRAME175]`, `[FRAME176]`, `[FRAME177]`, `[FRAME178]`, `[FRAME179]`, `[FRAME180]`, `[FRAME181]`。

`[FRAME182]`, `[FRAME183]`, `[FRAME184]`, `[FRAME185]`, `[FRAME186]`, `[FRAME187]`, `[FRAME188]`, `[FRAME189]`, `[FRAME190]`, `[FRAME191]`。

`[FRAME192]`, `[FRAME193]`, `[FRAME194]`, `[FRAME195]`, `[FRAME196]`, `[FRAME197]`, `[FRAME198]`, `[FRAME199]`, `[FRAME200]`, `[FRAME201]`。

`[FRAME202]`, `[FRAME203]`, `[FRAME204]`, `[FRAME205]`, `[FRAME206]`, `[FRAME207]`, `[FRAME208]`, `[FRAME209]`, `[FRAME210]`, `[FRAME211]`。

`[FRAME212]`, `[FRAME213]`, `[FRAME214]`, `[FRAME215]`, `[FRAME216]`, `[FRAME217]`, `[FRAME218]`, `[FRAME219]`, `[FRAME220]`, `[FRAME221]`。

`[FRAME222]`, `[FRAME223]`, `[FRAME224]`, `[FRAME225]`, `[FRAME226]`, `[FRAME227]`, `[FRAME228]`, `[FRAME229]`, `[FRAME230]`, `[FRAME231]`。

`[FRAME232]`, `[FRAME233]`, `[FRAME234]`, `[FRAME235]`, `[FRAME236]`, `[FRAME237]`, `[FRAME238]`, `[FRAME239]`, `[FRAME240]`, `[FRAME241]`。

`[FRAME242]`, `[FRAME243]`, `[FRAME244]`, `[FRAME245]`, `[FRAME246]`, `[FRAME247]`, `[FRAME248]`, `[FRAME249]`, `[FRAME250]`, `[FRAME251]`。

`[FRAME252]`, `[FRAME253]`, `[FRAME254]`, `[FRAME255]`, `[FRAME256]`, `[FRAME257]`, `[FRAME258]`, `[FRAME259]`, `[FRAME260]`, `[FRAME261]`。

`[FRAME262]`, `[FRAME263]`, `[FRAME264]`, `[FRAME265]`, `[FRAME266]`, `[FRAME267]`, `[FRAME268]`, `[FRAME269]`, `[FRAME270]`, `[FRAME271]`。

`[FRAME272]`, `[FRAME273]`, `[FRAME274]`, `[FRAME275]`, `[FRAME276]`, `[FRAME277]`, `[FRAME278]`, `[FRAME279]`, `[FRAME280]`, `[FRAME281]`。

`[FRAME282]`, `[FRAME283]`, `[FRAME284]`, `[FRAME285]`, `[FRAME286]`, `[FRAME287]`, `[FRAME288]`, `[FRAME289]`, `[FRAME290]`, `[FRAME291]`。

`[FRAME292]`, `[FRAME293]`, `[FRAME294]`, `[FRAME295]`, `[FRAME296]`, `[FRAME297]`, `[FRAME298]`, `[FRAME299]`, `[FRAME300]`, `[FRAME301]`。

`[FRAME302]`, `[FRAME303]`, `[FRAME304]`, `[FRAME305]`, `[FRAME306]`, `[FRAME307]`, `[FRAME308]`, `[FRAME309]`, `[FRAME310]`, `[FRAME311]`。

`[FRAME312]`, `[FRAME313]`, `[FRAME314]`, `[FRAME315]`, `[FRAME316]`, `[FRAME317]`, `[FRAME318]`, `[FRAME319]`, `[FRAME320]`, `[FRAME321]`。

`[FRAME322]`, `[FRAME323]`, `[FRAME324]`, `[FRAME325]`, `[FRAME326]`, `[FRAME327]`, `[FRAME328]`, `[FRAME329]`, `[FRAME330]`, `[FRAME331]`。

`[FRAME332]`, `[FRAME333]`, `[FRAME334]`, `[FRAME335]`, `[FRAME336]`, `[FRAME337]`, `[FRAME338]`, `[FRAME339]`, `[FRAME340]`, `[FRAME341]`。

`[FRAME342]`, `[FRAME343]`, `[FRAME344]`, `[FRAME345]`, `[FRAME346]`, `[FRAME347]`, `[FRAME348]`, `[FRAME349]`, `[FRAME350]`, `[FRAME351]`。

`[FRAME352]`, `[FRAME353]`, `[FRAME354]`, `[FRAME355]`, `[FRAME356]`, `[FRAME357]`, `[FRAME358]`, `[FRAME359]`, `[FRAME360]`, `[FRAME361]`。

`[FRAME362]`, `[FRAME363]`, `[FRAME364]`, `[FRAME365]`, `[FRAME366]`, `[FRAME367]`, `[FRAME368]`, `[FRAME369]`, `[FRAME370]`, `[FRAME371]`。

`[FRAME372]`, `[FRAME373]`, `[FRAME374]`, `[FRAME375]`, `[FRAME376]`, `[FRAME377]`, `[FRAME378]`, `[FRAME379]`, `[FRAME380]`, `[FRAME381]`。

`[FRAME382]`, `[FRAME383]`, `[FRAME384]`, `[FRAME385]`, `[FRAME386]`, `[FRAME387]`, `[FRAME388]`, `[FRAME389]`, `[FRAME390]`, `[FRAME391]`。

`[FRAME392]`, `[FRAME393]`, `[FRAME394]`, `[FRAME395]`, `[FRAME396]`, `[FRAME397]`, `[FRAME398]`, `[FRAME399]`, `[FRAME400]`, `[FRAME401]`。

`[FRAME402]`, `[FRAME403]`, `[FRAME404]`, `[FRAME405]`, `[FRAME406]`, `[FRAME407]`, `[FRAME408]`, `[FRAME409]`, `[FRAME410]`, `[FRAME411]`。

`[FRAME412]`, `[FRAME413]`, `[FRAME414]`, `[FRAME415]`, `[FRAME416]`, `[FRAME417]`, `[FRAME418]`, `[FRAME419]`, `[FRAME420]`, `[FRAME421]`。

`[FRAME422]`, `[FRAME423]`, `[FRAME424]`, `[FRAME425]`, `[FRAME426]`, `[FRAME427]`, `[FRAME428]`, `[FRAME429]`, `[FRAME430]`, `[FRAME431]`。

`[FRAME432]`, `[FRAME433]`, `[FRAME434]`, `[FRAME435]`, `[FRAME436]`, `[FRAME437]`, `[FRAME438]`, `[FRAME439]`, `[FRAME440]`, `[FRAME441]`。

`[FRAME442]`, `[FRAME443]`, `[FRAME444]`, `[FRAME445]`, `[FRAME446]`, `[FRAME447]`, `[FRAME448]`, `[FRAME449]`, `[FRAME450]`, `[FRAME451]`。

`[FRAME452]`, `[FRAME453]`, `[FRAME454]`, `[FRAME455]`, `[FRAME456]`, `[FRAME457]`, `[FRAME458]`, `[FRAME459]`, `[FRAME460]`, `[FRAME461]`。

`[FRAME462]`, `[FRAME463]`, `[FRAME464]`, `[FRAME465]`, `[FRAME466]`, `[FRAME467]`, `[FRAME468]`, `[FRAME469]`, `[FRAME470]`, `[FRAME471]`。

`[FRAME472]`, `[FRAME473]`, `[FRAME474]`, `[FRAME475]`, `[FRAME476]`, `[FRAME477]`, `[FRAME478]`, `[FRAME479]`, `[FRAME480]`, `[FRAME481]`。

`[FRAME482]`, `[FRAME483]`, `[FRAME484]`, `[FRAME485]`, `[FRAME486]`, `[FRAME487]`, `[FRAME488]`, `[FRAME489]`, `[FRAME490]`, `[FRAME491]`。

`[FRAME492]`, `[FRAME493]`, `[FRAME494]`, `[FRAME495]`, `[FRAME496]`, `[FRAME497]`, `[FRAME498]`, `[FRAME499]`, `[FRAME500]`, `[FRAME501]`。

`[FRAME502]`, `[FRAME503]`, `[FRAME504]`, `[FRAME505]`, `[FRAME506]`, `[FRAME507]`, `[FRAME508]`, `[FRAME509]`, `[FRAME510]`, `[FRAME511]`。

`[FRAME512]`, `[FRAME513]`, `[FRAME514]`, `[FRAME515]`, `[FRAME516]`, `[FRAME517]`, `[FRAME518]`, `[FRAME519]`, `[FRAME520]`, `[FRAME521]`。

`[FRAME522]`, `[FRAME523]`, `[FRAME524]`, `[FRAME525]`, `[FRAME526]`, `[FRAME527]`, `[FRAME528]`, `[FRAME529]`, `[FRAME530]`, `[FRAME531]`。

`[FRAME532]`, `[FRAME533]`, `[FRAME534]`, `[FRAME535]`, `[FRAME536]`, `[FRAME537]`, `[FRAME538]`, `[FRAME539]`, `[FRAME540]`, `[FRAME541]`。

`[FRAME542]`, `[FRAME543]`, `[FRAME544]`, `[FRAME545]`, `[FRAME546]`, `[FRAME547]`, `[FRAME548]`, `[FRAME549]`, `[FRAME550]`, `[FRAME551]`。

`[FRAME552]`, `[FRAME553]`, `[FRAME554]`, `[FRAME555]`, `[FRAME556]`, `[FRAME557]`, `[FRAME558]`, `[FRAME559]`, `[FRAME560]`, `[FRAME561]`。

`[FRAME562]`, `[FRAME563]`, `[FRAME564]`, `[FRAME565]`, `[FRAME566]`, `[FRAME567]`, `[FRAME568]`, `[FRAME569]`, `[FRAME570]`, `[FRAME571]`。

`[FRAME572]`, `[FRAME573]`, `[FRAME574]`, `[FRAME575]`, `[FRAME576]`, `[FRAME577]`, `[FRAME578]`, `[FRAME579]`, `[FRAME580]`, `[FRAME581]`。

`[FRAME582]`, `[FRAME583]`, `[FRAME584]`, `[FRAME585]`, `[FRAME586]`, `[FRAME587]`, `[FRAME588]`, `[FRAME589]`, `[FRAME590]`, `[FRAME591]`。

`[FRAME592]`, `[FRAME593]`, `[FRAME594]`, `[FRAME595]`, `[FRAME596]`, `[FRAME597]`, `[FRAME598]`, `[FRAME599]`, `[FRAME600]`, `[FRAME601]`。

`[FRAME602]`, `[FRAME603]`, `[FRAME604]`, `[FRAME605]`, `[FRAME606]`, `[FRAME607]`, `[FRAME608]`, `[FRAME609]`, `[FRAME610]`, `[FRAME611]`。

`[FRAME612]`, `[FRAME613]`, `[FRAME614]`, `[FRAME615]`, `[FRAME616]`, `[FRAME617]`, `[FRAME618]`, `[FRAME619]`, `[FRAME620]`, `[FRAME621]`。

`[FRAME622]`, `[FRAME623]`, `[FRAME624]`, `[FRAME625]`, `[FRAME626]`, `[FRAME627]`, `[FRAME628]`, `[FRAME629]`, `[FRAME630]`, `[FRAME631]`。

`[FRAME632]`, `[FRAME633]`, `[FRAME634]`, `[FRAME635]`, `[FRAME636]`, `[FRAME637]`, `[FRAME638]`, `[FRAME639]`, `[FRAME640]`, `[FRAME641]`。

`[FRAME642]`, `[FRAME643]`, `[FRAME644]`, `[FRAME645]`, `[FRAME646]`, `[FRAME647]`, `[FRAME648]`, `[FRAME649]`, `[FRAME650]`, `[FRAME651]`。

`[FRAME652]`, `[FRAME653]`, `[FRAME654]`, `[FRAME655]`, `[FRAME656]`, `[FRAME657]`, `[FRAME658]`, `[FRAME659]`, `[FRAME660]`, `[FRAME661]`。

`[FRAME662]`, `[FRAME663]`, `[FRAME664]`, `[FRAME665]`, `[FRAME666]`, `[FRAME667]`, `[FRAME668]`, `[FRAME669]`, `[FRAME670]`, `[FRAME671]`。

`[FRAME672]`, `[FRAME673]`, `[FRAME674]`, `[FRAME675]`, `[FRAME676]`, `[FRAME677]`, `[FRAME678]`, `[FRAME679]`, `[FRAME680]`, `[FRAME681]`。

`[FRAME682]`, `[FRAME683]`, `[FRAME684]`, `[FRAME685]`, `[FRAME686]`, `[FRAME687]`, `[FRAME688]`, `[FRAME689]`, `[FRAME690]`, `[FRAME691]`。

`[FRAME692]`, `[FRAME693]`, `[FRAME694]`, `[FRAME695]`, `[FRAME696]`, `[FRAME697]`, `[FRAME698]`, `[FRAME699]`, `[FRAME700]`, `[FRAME701]`。

`[FRAME702]`, `[FRAME703]`, `[FRAME704]`, `[FRAME705]`, `[FRAME706]`, `[FRAME707]`, `[FRAME708]`, `[FRAME709]`, `[FRAME710]`, `[FRAME711]`。

`[FRAME712]`, `[FRAME713]`, `[FRAME714]`, `[FRAME715]`, `[FRAME716]`, `[FRAME717]`, `[FRAME718]`, `[FRAME719]`, `[FRAME720]`, `[FRAME721]`。

`[FRAME722]`, `[FRAME723]`, `[FRAME724]`, `[FRAME725]`, `[FRAME726]`, `[FRAME727]`, `[FRAME728]`, `[FRAME729]`, `[FRAME730]`, `[FRAME731]`。

`[FRAME732]`, `[FRAME733]`, `[FRAME734]`, `[FRAME735]`, `[FRAME736]`, `[FRAME737]`, `[FRAME738]`, `[FRAME739]`, `[FRAME740]`, `[FRAME741]`。

`[FRAME742]`, `[FRAME743]`, `[FRAME744]`, `[FRAME745]`, `[FRAME746]`, `[FRAME747]`, `[FRAME748]`, `[FRAME749]`, `[FRAME750]`, `[FRAME751]`。

`[FRAME752]`, `[FRAME753]`, `[FRAME754]`, `[FRAME755]`, `[FRAME756]`, `[FRAME757]`, `[FRAME758]`, `[FRAME759]`, `[FRAME760]`, `[FRAME761]`。

`[FRAME762]`, `[FRAME763]`, `[FRAME764]`, `[FRAME765]`, `[FRAME766]`, `[FRAME767]`, `[FRAME768]`, `[FRAME769]`, `[FRAME770]`, `[FRAME771]`。

`[FRAME772]`, `[FRAME773]`, `[FRAME774]`, `[FRAME775]`, `[FRAME776]`, `[FRAME777]`, `[FRAME778]`, `[FRAME779]`, `[FRAME780]`, `[FRAME781]`。

`[FRAME782]`, `[FRAME783]`, `[FRAME784]`, `[FRAME785]`, `[FRAME786]`, `[FRAME787]`, `[FRAME788]`, `[FRAME789]`, `[FRAME790]`, `[FRAME791]`。

`[FRAME792]`, `[FRAME793]`, `[FRAME794]`, `[FRAME795]`, `[FRAME796]`, `[FRAME797]`, `[FRAME798]`, `[FRAME799]`, `[FRAME800]`, `[FRAME801]`。

`[FRAME802]`, `[FRAME803]`, `[FRAME804]`, `[FRAME805]`, `[FRAME806]`, `[FRAME807]`, `[FRAME808]`, `[FRAME809]`, `[FRAME810]`, `[FRAME811]`。

`[FRAME812]`, `[FRAME813]`, `[FRAME814]`, `[FRAME815]`, `[FRAME816]`, `[FRAME817]`, `[FRAME818]`, `[FRAME819]`, `[FRAME820]`, `[FRAME821]`。

`[FRAME822]`, `[FRAME823]`, `[FRAME824]`, `[FRAME825]`, `[FRAME826]`, `[FRAME827]`, `[FRAME828]`, `[FRAME829]`, `[FRAME830]`, `[FRAME831]`。

`[FRAME832]`, `[FRAME833]`, `[FRAME834]`, `[FRAME835]`, `[FRAME836]`, `[FRAME837]`, `[FRAME838]`, `[FRAME839]`, `[FRAME840]`, `[FRAME841]`。

`[FRAME842]`, `[FRAME843]`, `[FRAME844]`, `[FRAME845]`, `[FRAME846]`, `[FRAME847]`, `[FRAME848]`, `[FRAME849]`, `[FRAME850]`, `[FRAME851]`。

`[FRAME852]`, `[FRAME853]`, `[FRAME854]`, `[FRAME855]`, `[FRAME856]`, `[FRAME857]`, `[FRAME858]`, `[FRAME859]`, `[FRAME860]`, `[FRAME861]`。

`[FRAME862]`, `[FRAME863]`, `[FRAME864]`, `[FRAME865]`, `[FRAME866]`, `[FRAME867]`, `[FRAME868]`, `[FRAME869]`, `[FRAME870]`, `[FRAME871]`。

`[FRAME872]`, `[FRAME873]`, `[FRAME874]`, `[FRAME875]`, `[FRAME876]`, `[FRAME877]`, `[FRAME878]`, `[FRAME879]`, `[FRAME880]`, `[FRAME881]`。

`[FRAME882]`, `[FRAME883]`, `[FRAME884]`, `[FRAME885]`, `[FRAME886]`, `[FRAME887]`, `[FRAME888]`, `[FRAME889]`, `[FRAME890]`, `[FRAME891]`。

`[FRAME892]`, `[FRAME893]`, `[FRAME894]`, `[FRAME895]`, `[FRAME896]`, `[FRAME897]`, `[FRAME898]`, `[FRAME899]`, `[FRAME900]`, `[FRAME901]`。

`[FRAME902]`, `[FRAME903]`, `[FRAME904]`, `[FRAME905]`, `[FRAME906]`, `[FRAME907]`, `[FRAME908]`, `[FRAME909]`, `[FRAME910]`, `[FRAME911]`。

`[FRAME912]`, `[FRAME913]`, `[FRAME914]`, `[FRAME915]`, `[FRAME916]`, `[FRAME917]`, `[FRAME918]`, `[FRAME919]`, `[FRAME920]`, `[FRAME921]`。

`[FRAME922]`, `[FRAME923]`, `[FRAME924]`, `[FRAME925]`, `[FRAME926]`, `[FRAME927]`, `[FRAME928]`, `[FRAME929]`, `[FRAME930]`, `[FRAME931]`。

`[FRAME932]`, `[FRAME933]`, `[FRAME934]`, `[FRAME935]`, `[FRAME936]`, `[FRAME937]`, `[FRAME938]`, `[FRAME939]`, `[FRAME940]`, `[FRAME941]`。

`[FRAME942]`, `[FRAME943]`, `[FRAME944]`, `[FRAME945]`, `[FRAME946]`, `[FRAME947]`, `[FRAME948]`, `[FRAME949]`, `[FRAME950]`, `[FRAME951]`。

`[FRAME952]`, `[FRAME953]`, `[FRAME954]`, `[FRAME955]`, `[FRAME956]`, `[FRAME957]`, `[FRAME958]`, `[FRAME959]`, `[FRAME960]`, `[FRAME961]`。

`[FRAME962]`, `[FRAME963]`, `[FRAME964]`, `[FRAME965]`, `[FRAME966]`, `[FRAME967]`, `[FRAME968]`, `[FRAME969]`, `[FRAME970]`, `[FRAME971]`。

`[FRAME972]`, `[FRAME973]`, `[FRAME974]`, `[FRAME975]`, `[FRAME976]`, `[FRAME977]`, `[FRAME978]`, `[FRAME979]`, `[FRAME980]`, `[FRAME981]`。

`[FRAME982]`, `[FRAME983]`, `[FRAME984]`, `[FRAME985]`, `[FRAME986]`, `[FRAME987]`, `[FRAME988]`, `[FRAME989]`, `[FRAME990]`, `[FRAME991]`。

`[FRAME992]`, `[FRAME993]`, `[FRAME994]`, `[FRAME995]`, `[FRAME996]`, `[FRAME997]`, `[FRAME998]`, `[FRAME999]`, `[FRAME1000]`, `[FRAME1001]`。

`[FRAME1002]`, `[FRAME1003]`, `[FRAME1004]`, `[FRAME1005]`, `[FRAME1006]`, `[FRAME1007]`, `[FRAME1008]`, `[FRAME1009]`, `[FRAME1010]`, `[FRAME1011]`。

`[FRAME1012]`, `[FRAME1013]`, `[FRAME1014]`, `[FRAME1015]`, `[FRAME1016]`, `[FRAME1017]`, `[FRAME1018]`, `[FRAME1019]`, `[FRAME1020]`, `[FRAME1021]`。

`[FRAME1022]`, `[FRAME1023]`, `[FRAME1024]`, `[FRAME1025]`, `[FRAME1026]`, `[FRAME1027]`, `[FRAME1028]`, `[FRAME1029]`, `[FRAME1030]`, `[FRAME1031]`。

`[FRAME1032]`, `[FRAME1033]`, `[FRAME1034]`, `[FRAME1035]`, `[FRAME1036]`, `[FRAME1037]`, `[FRAME1038]`, `[FRAME1039]`, `[FRAME1040]`, `[FRAME1041]`。

`[FRAME1042]`, `[FRAME1043]`, `[FRAME1044]`, `[FRAME1045]`, `[FRAME1046]`, `[FRAME1047]`, `[FRAME1048]`, `[FRAME1049]`, `[FRAME1050]`, `[FRAME1051]`。

`[FRAME1052]`, `[FRAME1053]`, `[FRAME1054]`, `[FRAME1055]`, `[FRAME1056]`, `[FRAME1057]`, `[FRAME1058]`, `[FRAME1059]`, `[FRAME1060]`, `[FRAME1061]`。

`[FRAME1062]`, `[FRAME1063]`, `[FRAME1064]`, `[FRAME1065]`, `[FRAME1066]`, `[FRAME1067]`, `[FRAME1068]`, `[FRAME1069]`, `[FRAME1070]`, `[FRAME1071]`。

`[FRAME1072]`, `[FRAME1073]`, `[FRAME1074]`, `[FRAME1075]`, `[FRAME1076]`, `[FRAME1077]`, `[FRAME1078]`, `[FRAME1079]`, `[FRAME1080]`, `[FRAME1081]`。

`[FRAME1082]`, `[FRAME1083]`, `[FRAME1084]`, `[FRAME1085]`, `[FRAME1086]`, `[FRAME1087]`, `[FRAME1088]`, `[FRAME1089]`, `[FRAME1090]`, `[FRAME1091]`。

`[FRAME1092]`, `[FRAME1093]`, `[FRAME1094]`, `[FRAME1095]`, `[FRAME1096]`, `[FRAME1097]`, `[FRAME1098]`, `[FRAME1099]`, `[FRAME1100]`, `[FRAME1101]`。

`[FRAME1102]`, `[FRAME1103]`, `[FRAME1104]`, `[FRAME1105]`, `[FRAME1106]`, `[FRAME1107]`, `[FRAME1108]`, `[FRAME1109]`, `[FRAME1110]`, `[FRAME1111]`。

`[FRAME1112]`, `[FRAME1113]`, `[FRAME1114]`, `[FRAME1115]`, `[FRAME1116]`, `[FRAME1117]`, `[GRAPHIC EFFECT]`, `[IMAGE]`, `[IMAGE POS]`, `[IMAGE RATE]`。

`[IMAGE ROTATE]`, `[INTERPOLATION]`, `[LOOP]`, `[LOOP END]`, `[LOOP START]`, `[OPERATION]`, `[PLAY SOUND]`, `[RGBA]`, `[SET FLAG]`, `[SHADOW]`。

`[SPECTRUM]`, `[SPECTRUM COLOR]`, `[SPECTRUM EFFECT]`, `[SPECTRUM LIFE TIME]`, `[SPECTRUM TERM]`。

## 字段统计表

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[ATTACK BOX]` | 2 | 47949 | 9535 |
| `[CLIP]` | 2 | 1645 | 90 |
| `[COORD]` | 2 | 1446 | 1446 |
| `[DAMAGE BOX]` | 2 | 332392 | 46596 |
| `[DAMAGE TYPE]` | 2 | 205428 | 19027 |
| `[DELAY]` | 2 | 1041665 | 114164 |
| `[FLIP TYPE]` | 2 | 4237 | 509 |
| `[FRAME MAX]` | 2 | 114326 | 114326 |
| `[FRAME000]` | 2 | 114288 | 114288 |
| `[FRAME001]` | 2 | 86805 | 86805 |
| `[FRAME002]` | 2 | 81198 | 81198 |
| `[FRAME003]` | 2 | 76361 | 76361 |
| `[FRAME004]` | 2 | 69170 | 69170 |
| `[FRAME005]` | 2 | 58793 | 58793 |
| `[FRAME006]` | 2 | 47942 | 47942 |
| `[FRAME007]` | 2 | 42671 | 42671 |
| `[FRAME008]` | 2 | 35644 | 35644 |
| `[FRAME009]` | 2 | 31736 | 31736 |
| `[FRAME010]` | 2 | 27852 | 27852 |
| `[FRAME011]` | 2 | 25120 | 25120 |
| `[FRAME012]` | 2 | 22069 | 22069 |
| `[FRAME013]` | 2 | 20275 | 20275 |
| `[FRAME014]` | 2 | 18668 | 18668 |
| `[FRAME015]` | 2 | 17088 | 17088 |
| `[FRAME016]` | 2 | 14698 | 14698 |
| `[FRAME017]` | 2 | 13631 | 13631 |
| `[FRAME018]` | 2 | 12739 | 12739 |
| `[FRAME019]` | 2 | 11946 | 11946 |
| `[FRAME020]` | 2 | 11006 | 11006 |
| `[FRAME021]` | 2 | 10244 | 10244 |
| `[FRAME022]` | 2 | 9629 | 9629 |
| `[FRAME023]` | 2 | 9072 | 9072 |
| `[FRAME024]` | 2 | 8427 | 8427 |
| `[FRAME025]` | 2 | 7823 | 7823 |
| `[FRAME026]` | 2 | 7154 | 7154 |
| `[FRAME027]` | 2 | 6722 | 6722 |
| `[FRAME028]` | 2 | 6320 | 6320 |
| `[FRAME029]` | 2 | 6112 | 6112 |
| `[FRAME030]` | 2 | 5602 | 5602 |
| `[FRAME031]` | 2 | 5127 | 5127 |
| `[FRAME032]` | 2 | 4711 | 4711 |
| `[FRAME033]` | 2 | 4427 | 4427 |
| `[FRAME034]` | 2 | 4259 | 4259 |
| `[FRAME035]` | 2 | 4111 | 4111 |
| `[FRAME036]` | 2 | 3951 | 3951 |
| `[FRAME037]` | 2 | 3729 | 3729 |
| `[FRAME038]` | 2 | 3628 | 3628 |
| `[FRAME039]` | 2 | 3499 | 3499 |
| `[FRAME040]` | 2 | 3366 | 3366 |
| `[FRAME041]` | 2 | 3197 | 3197 |
| `[FRAME042]` | 2 | 3058 | 3058 |
| `[FRAME043]` | 2 | 2939 | 2939 |
| `[FRAME044]` | 2 | 2846 | 2846 |
| `[FRAME045]` | 2 | 2568 | 2568 |
| `[FRAME046]` | 2 | 2487 | 2487 |
| `[FRAME047]` | 2 | 2368 | 2368 |
| `[FRAME048]` | 2 | 2179 | 2179 |
| `[FRAME049]` | 2 | 2100 | 2100 |
| `[FRAME050]` | 2 | 2006 | 2006 |
| `[FRAME051]` | 2 | 1889 | 1889 |
| `[FRAME052]` | 2 | 1821 | 1821 |
| `[FRAME053]` | 2 | 1734 | 1734 |
| `[FRAME054]` | 2 | 1613 | 1613 |
| `[FRAME055]` | 2 | 1584 | 1584 |
| `[FRAME056]` | 2 | 1458 | 1458 |
| `[FRAME057]` | 2 | 1428 | 1428 |
| `[FRAME058]` | 2 | 1358 | 1358 |
| `[FRAME059]` | 2 | 1326 | 1326 |
| `[FRAME060]` | 2 | 1283 | 1283 |
| `[FRAME061]` | 2 | 1243 | 1243 |
| `[FRAME062]` | 2 | 1155 | 1155 |
| `[FRAME063]` | 2 | 1130 | 1130 |
| `[FRAME064]` | 2 | 1108 | 1108 |
| `[FRAME065]` | 2 | 1065 | 1065 |
| `[FRAME066]` | 2 | 1040 | 1040 |
| `[FRAME067]` | 2 | 1019 | 1019 |
| `[FRAME068]` | 2 | 999 | 999 |
| `[FRAME069]` | 2 | 974 | 974 |
| `[FRAME070]` | 2 | 910 | 910 |
| `[FRAME071]` | 2 | 887 | 887 |
| `[FRAME072]` | 2 | 866 | 866 |
| `[FRAME073]` | 2 | 847 | 847 |
| `[FRAME074]` | 2 | 827 | 827 |
| `[FRAME075]` | 2 | 812 | 812 |
| `[FRAME076]` | 2 | 797 | 797 |
| `[FRAME077]` | 2 | 776 | 776 |
| `[FRAME078]` | 2 | 769 | 769 |
| `[FRAME079]` | 2 | 763 | 763 |
| `[FRAME080]` | 2 | 749 | 749 |
| `[FRAME081]` | 2 | 678 | 678 |
| `[FRAME082]` | 2 | 654 | 654 |
| `[FRAME083]` | 2 | 650 | 650 |
| `[FRAME084]` | 2 | 645 | 645 |
| `[FRAME085]` | 2 | 637 | 637 |
| `[FRAME086]` | 2 | 636 | 636 |
| `[FRAME087]` | 2 | 631 | 631 |
| `[FRAME088]` | 2 | 551 | 551 |
| `[FRAME089]` | 2 | 541 | 541 |
| `[FRAME090]` | 2 | 525 | 525 |
| `[FRAME091]` | 2 | 478 | 478 |
| `[FRAME092]` | 2 | 472 | 472 |
| `[FRAME093]` | 2 | 468 | 468 |
| `[FRAME094]` | 2 | 453 | 453 |
| `[FRAME095]` | 2 | 452 | 452 |
| `[FRAME096]` | 2 | 441 | 441 |
| `[FRAME097]` | 2 | 424 | 424 |
| `[FRAME098]` | 2 | 424 | 424 |
| `[FRAME099]` | 2 | 418 | 418 |
| `[FRAME100]` | 2 | 392 | 392 |
| `[FRAME101]` | 2 | 391 | 391 |
| `[FRAME102]` | 2 | 389 | 389 |
| `[FRAME103]` | 2 | 379 | 379 |
| `[FRAME104]` | 2 | 379 | 379 |
| `[FRAME105]` | 2 | 375 | 375 |
| `[FRAME106]` | 2 | 373 | 373 |
| `[FRAME107]` | 2 | 373 | 373 |
| `[FRAME108]` | 2 | 370 | 370 |
| `[FRAME109]` | 2 | 370 | 370 |
| `[FRAME110]` | 2 | 362 | 362 |
| `[FRAME111]` | 2 | 339 | 339 |
| `[FRAME112]` | 2 | 332 | 332 |
| `[FRAME113]` | 2 | 328 | 328 |
| `[FRAME114]` | 2 | 324 | 324 |
| `[FRAME115]` | 2 | 304 | 304 |
| `[FRAME116]` | 2 | 301 | 301 |
| `[FRAME117]` | 2 | 299 | 299 |
| `[FRAME118]` | 2 | 299 | 299 |
| `[FRAME119]` | 2 | 298 | 298 |
| `[FRAME120]` | 2 | 291 | 291 |
| `[FRAME121]` | 2 | 289 | 289 |
| `[FRAME122]` | 2 | 289 | 289 |
| `[FRAME123]` | 2 | 287 | 287 |
| `[FRAME124]` | 2 | 285 | 285 |
| `[FRAME125]` | 2 | 198 | 198 |
| `[FRAME126]` | 2 | 198 | 198 |
| `[FRAME127]` | 2 | 198 | 198 |
| `[FRAME128]` | 2 | 196 | 196 |
| `[FRAME129]` | 2 | 195 | 195 |
| `[FRAME130]` | 2 | 194 | 194 |
| `[FRAME131]` | 2 | 189 | 189 |
| `[FRAME132]` | 2 | 187 | 187 |
| `[FRAME133]` | 2 | 186 | 186 |
| `[FRAME134]` | 2 | 186 | 186 |
| `[FRAME135]` | 2 | 184 | 184 |
| `[FRAME136]` | 2 | 184 | 184 |
| `[FRAME137]` | 2 | 184 | 184 |
| `[FRAME138]` | 2 | 184 | 184 |
| `[FRAME139]` | 2 | 179 | 179 |
| `[FRAME140]` | 2 | 179 | 179 |
| `[FRAME141]` | 2 | 175 | 175 |
| `[FRAME142]` | 2 | 175 | 175 |
| `[FRAME143]` | 2 | 175 | 175 |
| `[FRAME144]` | 2 | 172 | 172 |
| `[FRAME145]` | 2 | 172 | 172 |
| `[FRAME146]` | 2 | 168 | 168 |
| `[FRAME147]` | 2 | 164 | 164 |
| `[FRAME148]` | 2 | 163 | 163 |
| `[FRAME149]` | 2 | 161 | 161 |
| `[FRAME150]` | 2 | 158 | 158 |
| `[FRAME151]` | 2 | 158 | 158 |
| `[FRAME152]` | 2 | 157 | 157 |
| `[FRAME153]` | 2 | 79 | 79 |
| `[FRAME154]` | 2 | 79 | 79 |
| `[FRAME155]` | 2 | 78 | 78 |
| `[FRAME156]` | 2 | 76 | 76 |
| `[FRAME157]` | 2 | 69 | 69 |
| `[FRAME158]` | 2 | 69 | 69 |
| `[FRAME159]` | 2 | 69 | 69 |
| `[FRAME160]` | 2 | 69 | 69 |
| `[FRAME161]` | 2 | 69 | 69 |
| `[FRAME162]` | 2 | 69 | 69 |
| `[FRAME163]` | 2 | 69 | 69 |
| `[FRAME164]` | 2 | 69 | 69 |
| `[FRAME165]` | 2 | 67 | 67 |
| `[FRAME166]` | 1 | 65 | 65 |
| `[FRAME167]` | 1 | 65 | 65 |
| `[FRAME168]` | 1 | 65 | 65 |
| `[FRAME169]` | 1 | 65 | 65 |
| `[FRAME170]` | 1 | 65 | 65 |
| `[FRAME171]` | 1 | 65 | 65 |
| `[FRAME172]` | 1 | 65 | 65 |
| `[FRAME173]` | 1 | 64 | 64 |
| `[FRAME174]` | 1 | 63 | 63 |
| `[FRAME175]` | 1 | 63 | 63 |
| `[FRAME176]` | 1 | 63 | 63 |
| `[FRAME177]` | 1 | 62 | 62 |
| `[FRAME178]` | 1 | 62 | 62 |
| `[FRAME179]` | 1 | 62 | 62 |
| `[FRAME180]` | 1 | 62 | 62 |
| `[FRAME181]` | 1 | 58 | 58 |
| `[FRAME182]` | 1 | 58 | 58 |
| `[FRAME183]` | 1 | 56 | 56 |
| `[FRAME184]` | 1 | 55 | 55 |
| `[FRAME185]` | 1 | 54 | 54 |
| `[FRAME186]` | 1 | 54 | 54 |
| `[FRAME187]` | 1 | 54 | 54 |
| `[FRAME188]` | 1 | 54 | 54 |
| `[FRAME189]` | 1 | 54 | 54 |
| `[FRAME190]` | 1 | 54 | 54 |
| `[FRAME191]` | 1 | 52 | 52 |
| `[FRAME192]` | 1 | 48 | 48 |
| `[FRAME193]` | 1 | 41 | 41 |
| `[FRAME194]` | 1 | 41 | 41 |
| `[FRAME195]` | 1 | 41 | 41 |
| `[FRAME196]` | 1 | 40 | 40 |
| `[FRAME197]` | 1 | 40 | 40 |
| `[FRAME198]` | 1 | 40 | 40 |
| `[FRAME199]` | 1 | 40 | 40 |
| `[FRAME200]` | 1 | 37 | 37 |
| `[FRAME201]` | 1 | 37 | 37 |
| `[FRAME202]` | 1 | 37 | 37 |
| `[FRAME203]` | 1 | 37 | 37 |
| `[FRAME204]` | 1 | 37 | 37 |
| `[FRAME205]` | 1 | 37 | 37 |
| `[FRAME206]` | 1 | 37 | 37 |
| `[FRAME207]` | 1 | 37 | 37 |
| `[FRAME208]` | 1 | 33 | 33 |
| `[FRAME209]` | 1 | 33 | 33 |
| `[FRAME210]` | 1 | 33 | 33 |
| `[FRAME211]` | 1 | 33 | 33 |
| `[FRAME212]` | 1 | 33 | 33 |
| `[FRAME213]` | 1 | 26 | 26 |
| `[FRAME214]` | 1 | 26 | 26 |
| `[FRAME215]` | 1 | 26 | 26 |
| `[FRAME216]` | 1 | 23 | 23 |
| `[FRAME217]` | 1 | 23 | 23 |
| `[FRAME218]` | 1 | 16 | 16 |
| `[FRAME219]` | 1 | 16 | 16 |
| `[FRAME220]` | 1 | 16 | 16 |
| `[FRAME221]` | 1 | 16 | 16 |
| `[FRAME222]` | 1 | 16 | 16 |
| `[FRAME223]` | 1 | 16 | 16 |
| `[FRAME224]` | 1 | 15 | 15 |
| `[FRAME225]` | 1 | 15 | 15 |
| `[FRAME226]` | 1 | 10 | 10 |
| `[FRAME227]` | 1 | 10 | 10 |
| `[FRAME228]` | 1 | 10 | 10 |
| `[FRAME229]` | 1 | 10 | 10 |
| `[FRAME230]` | 1 | 10 | 10 |
| `[FRAME231]` | 1 | 10 | 10 |
| `[FRAME232]` | 1 | 10 | 10 |
| `[FRAME233]` | 1 | 10 | 10 |
| `[FRAME234]` | 1 | 10 | 10 |
| `[FRAME235]` | 1 | 10 | 10 |
| `[FRAME236]` | 1 | 10 | 10 |
| `[FRAME237]` | 1 | 10 | 10 |
| `[FRAME238]` | 1 | 10 | 10 |
| `[FRAME239]` | 1 | 10 | 10 |
| `[FRAME240]` | 1 | 10 | 10 |
| `[FRAME241]` | 1 | 10 | 10 |
| `[FRAME242]` | 1 | 10 | 10 |
| `[FRAME243]` | 1 | 10 | 10 |
| `[FRAME244]` | 1 | 10 | 10 |
| `[FRAME245]` | 1 | 10 | 10 |
| `[FRAME246]` | 1 | 10 | 10 |
| `[FRAME247]` | 1 | 10 | 10 |
| `[FRAME248]` | 1 | 10 | 10 |
| `[FRAME249]` | 1 | 10 | 10 |
| `[FRAME250]` | 1 | 10 | 10 |
| `[FRAME251]` | 1 | 10 | 10 |
| `[FRAME252]` | 1 | 10 | 10 |
| `[FRAME253]` | 1 | 10 | 10 |
| `[FRAME254]` | 1 | 10 | 10 |
| `[FRAME255]` | 1 | 10 | 10 |
| `[FRAME256]` | 1 | 10 | 10 |
| `[FRAME257]` | 1 | 10 | 10 |
| `[FRAME258]` | 1 | 10 | 10 |
| `[FRAME259]` | 1 | 10 | 10 |
| `[FRAME260]` | 1 | 10 | 10 |
| `[FRAME261]` | 1 | 8 | 8 |
| `[FRAME262]` | 1 | 8 | 8 |
| `[FRAME263]` | 1 | 8 | 8 |
| `[FRAME264]` | 1 | 8 | 8 |
| `[FRAME265]` | 1 | 8 | 8 |
| `[FRAME266]` | 1 | 8 | 8 |
| `[FRAME267]` | 1 | 8 | 8 |
| `[FRAME268]` | 1 | 8 | 8 |
| `[FRAME269]` | 1 | 8 | 8 |
| `[FRAME270]` | 1 | 8 | 8 |
| `[FRAME271]` | 1 | 8 | 8 |
| `[FRAME272]` | 1 | 8 | 8 |
| `[FRAME273]` | 1 | 8 | 8 |
| `[FRAME274]` | 1 | 8 | 8 |
| `[FRAME275]` | 1 | 8 | 8 |
| `[FRAME276]` | 1 | 8 | 8 |
| `[FRAME277]` | 1 | 8 | 8 |
| `[FRAME278]` | 1 | 8 | 8 |
| `[FRAME279]` | 1 | 8 | 8 |
| `[FRAME280]` | 1 | 8 | 8 |
| `[FRAME281]` | 1 | 8 | 8 |
| `[FRAME282]` | 1 | 8 | 8 |
| `[FRAME283]` | 1 | 8 | 8 |
| `[FRAME284]` | 1 | 8 | 8 |
| `[FRAME285]` | 1 | 8 | 8 |
| `[FRAME286]` | 1 | 8 | 8 |
| `[FRAME287]` | 1 | 8 | 8 |
| `[FRAME288]` | 1 | 8 | 8 |
| `[FRAME289]` | 1 | 8 | 8 |
| `[FRAME290]` | 1 | 8 | 8 |
| `[FRAME291]` | 1 | 8 | 8 |
| `[FRAME292]` | 1 | 8 | 8 |
| `[FRAME293]` | 1 | 8 | 8 |
| `[FRAME294]` | 1 | 8 | 8 |
| `[FRAME295]` | 1 | 8 | 8 |
| `[FRAME296]` | 1 | 8 | 8 |
| `[FRAME297]` | 1 | 8 | 8 |
| `[FRAME298]` | 1 | 8 | 8 |
| `[FRAME299]` | 1 | 8 | 8 |
| `[FRAME300]` | 1 | 8 | 8 |
| `[FRAME301]` | 1 | 8 | 8 |
| `[FRAME302]` | 1 | 8 | 8 |
| `[FRAME303]` | 1 | 8 | 8 |
| `[FRAME304]` | 1 | 7 | 7 |
| `[FRAME305]` | 1 | 6 | 6 |
| `[FRAME306]` | 1 | 6 | 6 |
| `[FRAME307]` | 1 | 6 | 6 |
| `[FRAME308]` | 1 | 6 | 6 |
| `[FRAME309]` | 1 | 6 | 6 |
| `[FRAME310]` | 1 | 6 | 6 |
| `[FRAME311]` | 1 | 6 | 6 |
| `[FRAME312]` | 1 | 6 | 6 |
| `[FRAME313]` | 1 | 6 | 6 |
| `[FRAME314]` | 1 | 6 | 6 |
| `[FRAME315]` | 1 | 6 | 6 |
| `[FRAME316]` | 1 | 6 | 6 |
| `[FRAME317]` | 1 | 6 | 6 |
| `[FRAME318]` | 1 | 6 | 6 |
| `[FRAME319]` | 1 | 6 | 6 |
| `[FRAME320]` | 1 | 6 | 6 |
| `[FRAME321]` | 1 | 6 | 6 |
| `[FRAME322]` | 1 | 6 | 6 |
| `[FRAME323]` | 1 | 6 | 6 |
| `[FRAME324]` | 1 | 5 | 5 |
| `[FRAME325]` | 1 | 5 | 5 |
| `[FRAME326]` | 1 | 5 | 5 |
| `[FRAME327]` | 1 | 5 | 5 |
| `[FRAME328]` | 1 | 5 | 5 |
| `[FRAME329]` | 1 | 5 | 5 |
| `[FRAME330]` | 1 | 5 | 5 |
| `[FRAME331]` | 1 | 5 | 5 |
| `[FRAME332]` | 1 | 5 | 5 |
| `[FRAME333]` | 1 | 5 | 5 |
| `[FRAME334]` | 1 | 5 | 5 |
| `[FRAME335]` | 1 | 5 | 5 |
| `[FRAME336]` | 1 | 5 | 5 |
| `[FRAME337]` | 1 | 5 | 5 |
| `[FRAME338]` | 1 | 4 | 4 |
| `[FRAME339]` | 1 | 4 | 4 |
| `[FRAME340]` | 1 | 4 | 4 |
| `[FRAME341]` | 1 | 4 | 4 |
| `[FRAME342]` | 1 | 4 | 4 |
| `[FRAME343]` | 1 | 4 | 4 |
| `[FRAME344]` | 1 | 4 | 4 |
| `[FRAME345]` | 1 | 4 | 4 |
| `[FRAME346]` | 1 | 4 | 4 |
| `[FRAME347]` | 1 | 4 | 4 |
| `[FRAME348]` | 1 | 4 | 4 |
| `[FRAME349]` | 1 | 4 | 4 |
| `[FRAME350]` | 1 | 4 | 4 |
| `[FRAME351]` | 1 | 4 | 4 |
| `[FRAME352]` | 1 | 4 | 4 |
| `[FRAME353]` | 1 | 4 | 4 |
| `[FRAME354]` | 1 | 4 | 4 |
| `[FRAME355]` | 1 | 4 | 4 |
| `[FRAME356]` | 1 | 4 | 4 |
| `[FRAME357]` | 1 | 4 | 4 |
| `[FRAME358]` | 1 | 4 | 4 |
| `[FRAME359]` | 1 | 4 | 4 |
| `[FRAME360]` | 1 | 4 | 4 |
| `[FRAME361]` | 1 | 3 | 3 |
| `[FRAME362]` | 1 | 3 | 3 |
| `[FRAME363]` | 1 | 3 | 3 |
| `[FRAME364]` | 1 | 3 | 3 |
| `[FRAME365]` | 1 | 3 | 3 |
| `[FRAME366]` | 1 | 3 | 3 |
| `[FRAME367]` | 1 | 3 | 3 |
| `[FRAME368]` | 1 | 3 | 3 |
| `[FRAME369]` | 1 | 3 | 3 |
| `[FRAME370]` | 1 | 3 | 3 |
| `[FRAME371]` | 1 | 3 | 3 |
| `[FRAME372]` | 1 | 3 | 3 |
| `[FRAME373]` | 1 | 3 | 3 |
| `[FRAME374]` | 1 | 3 | 3 |
| `[FRAME375]` | 1 | 3 | 3 |
| `[FRAME376]` | 1 | 1 | 1 |
| `[FRAME377]` | 1 | 1 | 1 |
| `[FRAME378]` | 1 | 1 | 1 |
| `[FRAME379]` | 1 | 1 | 1 |
| `[FRAME380]` | 1 | 1 | 1 |
| `[FRAME381]` | 1 | 1 | 1 |
| `[FRAME382]` | 1 | 1 | 1 |
| `[FRAME383]` | 1 | 1 | 1 |
| `[FRAME384]` | 1 | 1 | 1 |
| `[FRAME385]` | 1 | 1 | 1 |
| `[FRAME386]` | 1 | 1 | 1 |
| `[FRAME387]` | 1 | 1 | 1 |
| `[FRAME388]` | 1 | 1 | 1 |
| `[FRAME389]` | 1 | 1 | 1 |
| `[FRAME390]` | 1 | 1 | 1 |
| `[FRAME391]` | 1 | 1 | 1 |
| `[FRAME392]` | 1 | 1 | 1 |
| `[FRAME393]` | 1 | 1 | 1 |
| `[FRAME394]` | 1 | 1 | 1 |
| `[FRAME395]` | 1 | 1 | 1 |
| `[FRAME396]` | 1 | 1 | 1 |
| `[FRAME397]` | 1 | 1 | 1 |
| `[FRAME398]` | 1 | 1 | 1 |
| `[FRAME399]` | 1 | 1 | 1 |
| `[FRAME400]` | 1 | 1 | 1 |
| `[FRAME401]` | 1 | 1 | 1 |
| `[FRAME402]` | 1 | 1 | 1 |
| `[FRAME403]` | 1 | 1 | 1 |
| `[FRAME404]` | 1 | 1 | 1 |
| `[FRAME405]` | 1 | 1 | 1 |
| `[FRAME406]` | 1 | 1 | 1 |
| `[FRAME407]` | 1 | 1 | 1 |
| `[FRAME408]` | 1 | 1 | 1 |
| `[FRAME409]` | 1 | 1 | 1 |
| `[FRAME410]` | 1 | 1 | 1 |
| `[FRAME411]` | 1 | 1 | 1 |
| `[FRAME412]` | 1 | 1 | 1 |
| `[FRAME413]` | 1 | 1 | 1 |
| `[FRAME414]` | 1 | 1 | 1 |
| `[FRAME415]` | 1 | 1 | 1 |
| `[FRAME416]` | 1 | 1 | 1 |
| `[FRAME417]` | 1 | 1 | 1 |
| `[FRAME418]` | 1 | 1 | 1 |
| `[FRAME419]` | 1 | 1 | 1 |
| `[FRAME420]` | 1 | 1 | 1 |
| `[FRAME421]` | 1 | 1 | 1 |
| `[FRAME422]` | 1 | 1 | 1 |
| `[FRAME423]` | 1 | 1 | 1 |
| `[FRAME424]` | 1 | 1 | 1 |
| `[FRAME425]` | 1 | 1 | 1 |
| `[FRAME426]` | 1 | 1 | 1 |
| `[FRAME427]` | 1 | 1 | 1 |
| `[FRAME428]` | 1 | 1 | 1 |
| `[FRAME429]` | 1 | 1 | 1 |
| `[FRAME430]` | 1 | 1 | 1 |
| `[FRAME431]` | 1 | 1 | 1 |
| `[FRAME432]` | 1 | 1 | 1 |
| `[FRAME433]` | 1 | 1 | 1 |
| `[FRAME434]` | 1 | 1 | 1 |
| `[FRAME435]` | 1 | 1 | 1 |
| `[FRAME436]` | 1 | 1 | 1 |
| `[FRAME437]` | 1 | 1 | 1 |
| `[FRAME438]` | 1 | 1 | 1 |
| `[FRAME439]` | 1 | 1 | 1 |
| `[FRAME440]` | 1 | 1 | 1 |
| `[FRAME441]` | 1 | 1 | 1 |
| `[FRAME442]` | 1 | 1 | 1 |
| `[FRAME443]` | 1 | 1 | 1 |
| `[FRAME444]` | 1 | 1 | 1 |
| `[FRAME445]` | 1 | 1 | 1 |
| `[FRAME446]` | 1 | 1 | 1 |
| `[FRAME447]` | 1 | 1 | 1 |
| `[FRAME448]` | 1 | 1 | 1 |
| `[FRAME449]` | 1 | 1 | 1 |
| `[FRAME450]` | 1 | 1 | 1 |
| `[FRAME451]` | 1 | 1 | 1 |
| `[FRAME452]` | 1 | 1 | 1 |
| `[FRAME453]` | 1 | 1 | 1 |
| `[FRAME454]` | 1 | 1 | 1 |
| `[FRAME455]` | 1 | 1 | 1 |
| `[FRAME456]` | 1 | 1 | 1 |
| `[FRAME457]` | 1 | 1 | 1 |
| `[FRAME458]` | 1 | 1 | 1 |
| `[FRAME459]` | 1 | 1 | 1 |
| `[FRAME460]` | 1 | 1 | 1 |
| `[FRAME461]` | 1 | 1 | 1 |
| `[FRAME462]` | 1 | 1 | 1 |
| `[FRAME463]` | 1 | 1 | 1 |
| `[FRAME464]` | 1 | 1 | 1 |
| `[FRAME465]` | 1 | 1 | 1 |
| `[FRAME466]` | 1 | 1 | 1 |
| `[FRAME467]` | 1 | 1 | 1 |
| `[FRAME468]` | 1 | 1 | 1 |
| `[FRAME469]` | 1 | 1 | 1 |
| `[FRAME470]` | 1 | 1 | 1 |
| `[FRAME471]` | 1 | 1 | 1 |
| `[FRAME472]` | 1 | 1 | 1 |
| `[FRAME473]` | 1 | 1 | 1 |
| `[FRAME474]` | 1 | 1 | 1 |
| `[FRAME475]` | 1 | 1 | 1 |
| `[FRAME476]` | 1 | 1 | 1 |
| `[FRAME477]` | 1 | 1 | 1 |
| `[FRAME478]` | 1 | 1 | 1 |
| `[FRAME479]` | 1 | 1 | 1 |
| `[FRAME480]` | 1 | 1 | 1 |
| `[FRAME481]` | 1 | 1 | 1 |
| `[FRAME482]` | 1 | 1 | 1 |
| `[FRAME483]` | 1 | 1 | 1 |
| `[FRAME484]` | 1 | 1 | 1 |
| `[FRAME485]` | 1 | 1 | 1 |
| `[FRAME486]` | 1 | 1 | 1 |
| `[FRAME487]` | 1 | 1 | 1 |
| `[FRAME488]` | 1 | 1 | 1 |
| `[FRAME489]` | 1 | 1 | 1 |
| `[FRAME490]` | 1 | 1 | 1 |
| `[FRAME491]` | 1 | 1 | 1 |
| `[FRAME492]` | 1 | 1 | 1 |
| `[FRAME493]` | 1 | 1 | 1 |
| `[FRAME494]` | 1 | 1 | 1 |
| `[FRAME495]` | 1 | 1 | 1 |
| `[FRAME496]` | 1 | 1 | 1 |
| `[FRAME497]` | 1 | 1 | 1 |
| `[FRAME498]` | 1 | 1 | 1 |
| `[FRAME499]` | 1 | 1 | 1 |
| `[FRAME500]` | 1 | 1 | 1 |
| `[FRAME501]` | 1 | 1 | 1 |
| `[FRAME502]` | 1 | 1 | 1 |
| `[FRAME503]` | 1 | 1 | 1 |
| `[FRAME504]` | 1 | 1 | 1 |
| `[FRAME505]` | 1 | 1 | 1 |
| `[FRAME506]` | 1 | 1 | 1 |
| `[FRAME507]` | 1 | 1 | 1 |
| `[FRAME508]` | 1 | 1 | 1 |
| `[FRAME509]` | 1 | 1 | 1 |
| `[FRAME510]` | 1 | 1 | 1 |
| `[FRAME511]` | 1 | 1 | 1 |
| `[FRAME512]` | 1 | 1 | 1 |
| `[FRAME513]` | 1 | 1 | 1 |
| `[FRAME514]` | 1 | 1 | 1 |
| `[FRAME515]` | 1 | 1 | 1 |
| `[FRAME516]` | 1 | 1 | 1 |
| `[FRAME517]` | 1 | 1 | 1 |
| `[FRAME518]` | 1 | 1 | 1 |
| `[FRAME519]` | 1 | 1 | 1 |
| `[FRAME520]` | 1 | 1 | 1 |
| `[FRAME521]` | 1 | 1 | 1 |
| `[FRAME522]` | 1 | 1 | 1 |
| `[FRAME523]` | 1 | 1 | 1 |
| `[FRAME524]` | 1 | 1 | 1 |
| `[FRAME525]` | 1 | 1 | 1 |
| `[FRAME526]` | 1 | 1 | 1 |
| `[FRAME527]` | 1 | 1 | 1 |
| `[FRAME528]` | 1 | 1 | 1 |
| `[FRAME529]` | 1 | 1 | 1 |
| `[FRAME530]` | 1 | 1 | 1 |
| `[FRAME531]` | 1 | 1 | 1 |
| `[FRAME532]` | 1 | 1 | 1 |
| `[FRAME533]` | 1 | 1 | 1 |
| `[FRAME534]` | 1 | 1 | 1 |
| `[FRAME535]` | 1 | 1 | 1 |
| `[FRAME536]` | 1 | 1 | 1 |
| `[FRAME537]` | 1 | 1 | 1 |
| `[FRAME538]` | 1 | 1 | 1 |
| `[FRAME539]` | 1 | 1 | 1 |
| `[FRAME540]` | 1 | 1 | 1 |
| `[FRAME541]` | 1 | 1 | 1 |
| `[FRAME542]` | 1 | 1 | 1 |
| `[FRAME543]` | 1 | 1 | 1 |
| `[FRAME544]` | 1 | 1 | 1 |
| `[FRAME545]` | 1 | 1 | 1 |
| `[FRAME546]` | 1 | 1 | 1 |
| `[FRAME547]` | 1 | 1 | 1 |
| `[FRAME548]` | 1 | 1 | 1 |
| `[FRAME549]` | 1 | 1 | 1 |
| `[FRAME550]` | 1 | 1 | 1 |
| `[FRAME551]` | 1 | 1 | 1 |
| `[FRAME552]` | 1 | 1 | 1 |
| `[FRAME553]` | 1 | 1 | 1 |
| `[FRAME554]` | 1 | 1 | 1 |
| `[FRAME555]` | 1 | 1 | 1 |
| `[FRAME556]` | 1 | 1 | 1 |
| `[FRAME557]` | 1 | 1 | 1 |
| `[FRAME558]` | 1 | 1 | 1 |
| `[FRAME559]` | 1 | 1 | 1 |
| `[FRAME560]` | 1 | 1 | 1 |
| `[FRAME561]` | 1 | 1 | 1 |
| `[FRAME562]` | 1 | 1 | 1 |
| `[FRAME563]` | 1 | 1 | 1 |
| `[FRAME564]` | 1 | 1 | 1 |
| `[FRAME565]` | 1 | 1 | 1 |
| `[FRAME566]` | 1 | 1 | 1 |
| `[FRAME567]` | 1 | 1 | 1 |
| `[FRAME568]` | 1 | 1 | 1 |
| `[FRAME569]` | 1 | 1 | 1 |
| `[FRAME570]` | 1 | 1 | 1 |
| `[FRAME571]` | 1 | 1 | 1 |
| `[FRAME572]` | 1 | 1 | 1 |
| `[FRAME573]` | 1 | 1 | 1 |
| `[FRAME574]` | 1 | 1 | 1 |
| `[FRAME575]` | 1 | 1 | 1 |
| `[FRAME576]` | 1 | 1 | 1 |
| `[FRAME577]` | 1 | 1 | 1 |
| `[FRAME578]` | 1 | 1 | 1 |
| `[FRAME579]` | 1 | 1 | 1 |
| `[FRAME580]` | 1 | 1 | 1 |
| `[FRAME581]` | 1 | 1 | 1 |
| `[FRAME582]` | 1 | 1 | 1 |
| `[FRAME583]` | 1 | 1 | 1 |
| `[FRAME584]` | 1 | 1 | 1 |
| `[FRAME585]` | 1 | 1 | 1 |
| `[FRAME586]` | 1 | 1 | 1 |
| `[FRAME587]` | 1 | 1 | 1 |
| `[FRAME588]` | 1 | 1 | 1 |
| `[FRAME589]` | 1 | 1 | 1 |
| `[FRAME590]` | 1 | 1 | 1 |
| `[FRAME591]` | 1 | 1 | 1 |
| `[FRAME592]` | 1 | 1 | 1 |
| `[FRAME593]` | 1 | 1 | 1 |
| `[FRAME594]` | 1 | 1 | 1 |
| `[FRAME595]` | 1 | 1 | 1 |
| `[FRAME596]` | 1 | 1 | 1 |
| `[FRAME597]` | 1 | 1 | 1 |
| `[FRAME598]` | 1 | 1 | 1 |
| `[FRAME599]` | 1 | 1 | 1 |
| `[FRAME600]` | 1 | 1 | 1 |
| `[FRAME601]` | 1 | 1 | 1 |
| `[FRAME602]` | 1 | 1 | 1 |
| `[FRAME603]` | 1 | 1 | 1 |
| `[FRAME604]` | 1 | 1 | 1 |
| `[FRAME605]` | 1 | 1 | 1 |
| `[FRAME606]` | 1 | 1 | 1 |
| `[FRAME607]` | 1 | 1 | 1 |
| `[FRAME608]` | 1 | 1 | 1 |
| `[FRAME609]` | 1 | 1 | 1 |
| `[FRAME610]` | 1 | 1 | 1 |
| `[FRAME611]` | 1 | 1 | 1 |
| `[FRAME612]` | 1 | 1 | 1 |
| `[FRAME613]` | 1 | 1 | 1 |
| `[FRAME614]` | 1 | 1 | 1 |
| `[FRAME615]` | 1 | 1 | 1 |
| `[FRAME616]` | 1 | 1 | 1 |
| `[FRAME617]` | 1 | 1 | 1 |
| `[FRAME618]` | 1 | 1 | 1 |
| `[FRAME619]` | 1 | 1 | 1 |
| `[FRAME620]` | 1 | 1 | 1 |
| `[FRAME621]` | 1 | 1 | 1 |
| `[FRAME622]` | 1 | 1 | 1 |
| `[FRAME623]` | 1 | 1 | 1 |
| `[FRAME624]` | 1 | 1 | 1 |
| `[FRAME625]` | 1 | 1 | 1 |
| `[FRAME626]` | 1 | 1 | 1 |
| `[FRAME627]` | 1 | 1 | 1 |
| `[FRAME628]` | 1 | 1 | 1 |
| `[FRAME629]` | 1 | 1 | 1 |
| `[FRAME630]` | 1 | 1 | 1 |
| `[FRAME631]` | 1 | 1 | 1 |
| `[FRAME632]` | 1 | 1 | 1 |
| `[FRAME633]` | 1 | 1 | 1 |
| `[FRAME634]` | 1 | 1 | 1 |
| `[FRAME635]` | 1 | 1 | 1 |
| `[FRAME636]` | 1 | 1 | 1 |
| `[FRAME637]` | 1 | 1 | 1 |
| `[FRAME638]` | 1 | 1 | 1 |
| `[FRAME639]` | 1 | 1 | 1 |
| `[FRAME640]` | 1 | 1 | 1 |
| `[FRAME641]` | 1 | 1 | 1 |
| `[FRAME642]` | 1 | 1 | 1 |
| `[FRAME643]` | 1 | 1 | 1 |
| `[FRAME644]` | 1 | 1 | 1 |
| `[FRAME645]` | 1 | 1 | 1 |
| `[FRAME646]` | 1 | 1 | 1 |
| `[FRAME647]` | 1 | 1 | 1 |
| `[FRAME648]` | 1 | 1 | 1 |
| `[FRAME649]` | 1 | 1 | 1 |
| `[FRAME650]` | 1 | 1 | 1 |
| `[FRAME651]` | 1 | 1 | 1 |
| `[FRAME652]` | 1 | 1 | 1 |
| `[FRAME653]` | 1 | 1 | 1 |
| `[FRAME654]` | 1 | 1 | 1 |
| `[FRAME655]` | 1 | 1 | 1 |
| `[FRAME656]` | 1 | 1 | 1 |
| `[FRAME657]` | 1 | 1 | 1 |
| `[FRAME658]` | 1 | 1 | 1 |
| `[FRAME659]` | 1 | 1 | 1 |
| `[FRAME660]` | 1 | 1 | 1 |
| `[FRAME661]` | 1 | 1 | 1 |
| `[FRAME662]` | 1 | 1 | 1 |
| `[FRAME663]` | 1 | 1 | 1 |
| `[FRAME664]` | 1 | 1 | 1 |
| `[FRAME665]` | 1 | 1 | 1 |
| `[FRAME666]` | 1 | 1 | 1 |
| `[FRAME667]` | 1 | 1 | 1 |
| `[FRAME668]` | 1 | 1 | 1 |
| `[FRAME669]` | 1 | 1 | 1 |
| `[FRAME670]` | 1 | 1 | 1 |
| `[FRAME671]` | 1 | 1 | 1 |
| `[FRAME672]` | 1 | 1 | 1 |
| `[FRAME673]` | 1 | 1 | 1 |
| `[FRAME674]` | 1 | 1 | 1 |
| `[FRAME675]` | 1 | 1 | 1 |
| `[FRAME676]` | 1 | 1 | 1 |
| `[FRAME677]` | 1 | 1 | 1 |
| `[FRAME678]` | 1 | 1 | 1 |
| `[FRAME679]` | 1 | 1 | 1 |
| `[FRAME680]` | 1 | 1 | 1 |
| `[FRAME681]` | 1 | 1 | 1 |
| `[FRAME682]` | 1 | 1 | 1 |
| `[FRAME683]` | 1 | 1 | 1 |
| `[FRAME684]` | 1 | 1 | 1 |
| `[FRAME685]` | 1 | 1 | 1 |
| `[FRAME686]` | 1 | 1 | 1 |
| `[FRAME687]` | 1 | 1 | 1 |
| `[FRAME688]` | 1 | 1 | 1 |
| `[FRAME689]` | 1 | 1 | 1 |
| `[FRAME690]` | 1 | 1 | 1 |
| `[FRAME691]` | 1 | 1 | 1 |
| `[FRAME692]` | 1 | 1 | 1 |
| `[FRAME693]` | 1 | 1 | 1 |
| `[FRAME694]` | 1 | 1 | 1 |
| `[FRAME695]` | 1 | 1 | 1 |
| `[FRAME696]` | 1 | 1 | 1 |
| `[FRAME697]` | 1 | 1 | 1 |
| `[FRAME698]` | 1 | 1 | 1 |
| `[FRAME699]` | 1 | 1 | 1 |
| `[FRAME700]` | 1 | 1 | 1 |
| `[FRAME701]` | 1 | 1 | 1 |
| `[FRAME702]` | 1 | 1 | 1 |
| `[FRAME703]` | 1 | 1 | 1 |
| `[FRAME704]` | 1 | 1 | 1 |
| `[FRAME705]` | 1 | 1 | 1 |
| `[FRAME706]` | 1 | 1 | 1 |
| `[FRAME707]` | 1 | 1 | 1 |
| `[FRAME708]` | 1 | 1 | 1 |
| `[FRAME709]` | 1 | 1 | 1 |
| `[FRAME710]` | 1 | 1 | 1 |
| `[FRAME711]` | 1 | 1 | 1 |
| `[FRAME712]` | 1 | 1 | 1 |
| `[FRAME713]` | 1 | 1 | 1 |
| `[FRAME714]` | 1 | 1 | 1 |
| `[FRAME715]` | 1 | 1 | 1 |
| `[FRAME716]` | 1 | 1 | 1 |
| `[FRAME717]` | 1 | 1 | 1 |
| `[FRAME718]` | 1 | 1 | 1 |
| `[FRAME719]` | 1 | 1 | 1 |
| `[FRAME720]` | 1 | 1 | 1 |
| `[FRAME721]` | 1 | 1 | 1 |
| `[FRAME722]` | 1 | 1 | 1 |
| `[FRAME723]` | 1 | 1 | 1 |
| `[FRAME724]` | 1 | 1 | 1 |
| `[FRAME725]` | 1 | 1 | 1 |
| `[FRAME726]` | 1 | 1 | 1 |
| `[FRAME727]` | 1 | 1 | 1 |
| `[FRAME728]` | 1 | 1 | 1 |
| `[FRAME729]` | 1 | 1 | 1 |
| `[FRAME730]` | 1 | 1 | 1 |
| `[FRAME731]` | 1 | 1 | 1 |
| `[FRAME732]` | 1 | 1 | 1 |
| `[FRAME733]` | 1 | 1 | 1 |
| `[FRAME734]` | 1 | 1 | 1 |
| `[FRAME735]` | 1 | 1 | 1 |
| `[FRAME736]` | 1 | 1 | 1 |
| `[FRAME737]` | 1 | 1 | 1 |
| `[FRAME738]` | 1 | 1 | 1 |
| `[FRAME739]` | 1 | 1 | 1 |
| `[FRAME740]` | 1 | 1 | 1 |
| `[FRAME741]` | 1 | 1 | 1 |
| `[FRAME742]` | 1 | 1 | 1 |
| `[FRAME743]` | 1 | 1 | 1 |
| `[FRAME744]` | 1 | 1 | 1 |
| `[FRAME745]` | 1 | 1 | 1 |
| `[FRAME746]` | 1 | 1 | 1 |
| `[FRAME747]` | 1 | 1 | 1 |
| `[FRAME748]` | 1 | 1 | 1 |
| `[FRAME749]` | 1 | 1 | 1 |
| `[FRAME750]` | 1 | 1 | 1 |
| `[FRAME751]` | 1 | 1 | 1 |
| `[FRAME752]` | 1 | 1 | 1 |
| `[FRAME753]` | 1 | 1 | 1 |
| `[FRAME754]` | 1 | 1 | 1 |
| `[FRAME755]` | 1 | 1 | 1 |
| `[FRAME756]` | 1 | 1 | 1 |
| `[FRAME757]` | 1 | 1 | 1 |
| `[FRAME758]` | 1 | 1 | 1 |
| `[FRAME759]` | 1 | 1 | 1 |
| `[FRAME760]` | 1 | 1 | 1 |
| `[FRAME761]` | 1 | 1 | 1 |
| `[FRAME762]` | 1 | 1 | 1 |
| `[FRAME763]` | 1 | 1 | 1 |
| `[FRAME764]` | 1 | 1 | 1 |
| `[FRAME765]` | 1 | 1 | 1 |
| `[FRAME766]` | 1 | 1 | 1 |
| `[FRAME767]` | 1 | 1 | 1 |
| `[FRAME768]` | 1 | 1 | 1 |
| `[FRAME769]` | 1 | 1 | 1 |
| `[FRAME770]` | 1 | 1 | 1 |
| `[FRAME771]` | 1 | 1 | 1 |
| `[FRAME772]` | 1 | 1 | 1 |
| `[FRAME773]` | 1 | 1 | 1 |
| `[FRAME774]` | 1 | 1 | 1 |
| `[FRAME775]` | 1 | 1 | 1 |
| `[FRAME776]` | 1 | 1 | 1 |
| `[FRAME777]` | 1 | 1 | 1 |
| `[FRAME778]` | 1 | 1 | 1 |
| `[FRAME779]` | 1 | 1 | 1 |
| `[FRAME780]` | 1 | 1 | 1 |
| `[FRAME781]` | 1 | 1 | 1 |
| `[FRAME782]` | 1 | 1 | 1 |
| `[FRAME783]` | 1 | 1 | 1 |
| `[FRAME784]` | 1 | 1 | 1 |
| `[FRAME785]` | 1 | 1 | 1 |
| `[FRAME786]` | 1 | 1 | 1 |
| `[FRAME787]` | 1 | 1 | 1 |
| `[FRAME788]` | 1 | 1 | 1 |
| `[FRAME789]` | 1 | 1 | 1 |
| `[FRAME790]` | 1 | 1 | 1 |
| `[FRAME791]` | 1 | 1 | 1 |
| `[FRAME792]` | 1 | 1 | 1 |
| `[FRAME793]` | 1 | 1 | 1 |
| `[FRAME794]` | 1 | 1 | 1 |
| `[FRAME795]` | 1 | 1 | 1 |
| `[FRAME796]` | 1 | 1 | 1 |
| `[FRAME797]` | 1 | 1 | 1 |
| `[FRAME798]` | 1 | 1 | 1 |
| `[FRAME799]` | 1 | 1 | 1 |
| `[FRAME800]` | 1 | 1 | 1 |
| `[FRAME801]` | 1 | 1 | 1 |
| `[FRAME802]` | 1 | 1 | 1 |
| `[FRAME803]` | 1 | 1 | 1 |
| `[FRAME804]` | 1 | 1 | 1 |
| `[FRAME805]` | 1 | 1 | 1 |
| `[FRAME806]` | 1 | 1 | 1 |
| `[FRAME807]` | 1 | 1 | 1 |
| `[FRAME808]` | 1 | 1 | 1 |
| `[FRAME809]` | 1 | 1 | 1 |
| `[FRAME810]` | 1 | 1 | 1 |
| `[FRAME811]` | 1 | 1 | 1 |
| `[FRAME812]` | 1 | 1 | 1 |
| `[FRAME813]` | 1 | 1 | 1 |
| `[FRAME814]` | 1 | 1 | 1 |
| `[FRAME815]` | 1 | 1 | 1 |
| `[FRAME816]` | 1 | 1 | 1 |
| `[FRAME817]` | 1 | 1 | 1 |
| `[FRAME818]` | 1 | 1 | 1 |
| `[FRAME819]` | 1 | 1 | 1 |
| `[FRAME820]` | 1 | 1 | 1 |
| `[FRAME821]` | 1 | 1 | 1 |
| `[FRAME822]` | 1 | 1 | 1 |
| `[FRAME823]` | 1 | 1 | 1 |
| `[FRAME824]` | 1 | 1 | 1 |
| `[FRAME825]` | 1 | 1 | 1 |
| `[FRAME826]` | 1 | 1 | 1 |
| `[FRAME827]` | 1 | 1 | 1 |
| `[FRAME828]` | 1 | 1 | 1 |
| `[FRAME829]` | 1 | 1 | 1 |
| `[FRAME830]` | 1 | 1 | 1 |
| `[FRAME831]` | 1 | 1 | 1 |
| `[FRAME832]` | 1 | 1 | 1 |
| `[FRAME833]` | 1 | 1 | 1 |
| `[FRAME834]` | 1 | 1 | 1 |
| `[FRAME835]` | 1 | 1 | 1 |
| `[FRAME836]` | 1 | 1 | 1 |
| `[FRAME837]` | 1 | 1 | 1 |
| `[FRAME838]` | 1 | 1 | 1 |
| `[FRAME839]` | 1 | 1 | 1 |
| `[FRAME840]` | 1 | 1 | 1 |
| `[FRAME841]` | 1 | 1 | 1 |
| `[FRAME842]` | 1 | 1 | 1 |
| `[FRAME843]` | 1 | 1 | 1 |
| `[FRAME844]` | 1 | 1 | 1 |
| `[FRAME845]` | 1 | 1 | 1 |
| `[FRAME846]` | 1 | 1 | 1 |
| `[FRAME847]` | 1 | 1 | 1 |
| `[FRAME848]` | 1 | 1 | 1 |
| `[FRAME849]` | 1 | 1 | 1 |
| `[FRAME850]` | 1 | 1 | 1 |
| `[FRAME851]` | 1 | 1 | 1 |
| `[FRAME852]` | 1 | 1 | 1 |
| `[FRAME853]` | 1 | 1 | 1 |
| `[FRAME854]` | 1 | 1 | 1 |
| `[FRAME855]` | 1 | 1 | 1 |
| `[FRAME856]` | 1 | 1 | 1 |
| `[FRAME857]` | 1 | 1 | 1 |
| `[FRAME858]` | 1 | 1 | 1 |
| `[FRAME859]` | 1 | 1 | 1 |
| `[FRAME860]` | 1 | 1 | 1 |
| `[FRAME861]` | 1 | 1 | 1 |
| `[FRAME862]` | 1 | 1 | 1 |
| `[FRAME863]` | 1 | 1 | 1 |
| `[FRAME864]` | 1 | 1 | 1 |
| `[FRAME865]` | 1 | 1 | 1 |
| `[FRAME866]` | 1 | 1 | 1 |
| `[FRAME867]` | 1 | 1 | 1 |
| `[FRAME868]` | 1 | 1 | 1 |
| `[FRAME869]` | 1 | 1 | 1 |
| `[FRAME870]` | 1 | 1 | 1 |
| `[FRAME871]` | 1 | 1 | 1 |
| `[FRAME872]` | 1 | 1 | 1 |
| `[FRAME873]` | 1 | 1 | 1 |
| `[FRAME874]` | 1 | 1 | 1 |
| `[FRAME875]` | 1 | 1 | 1 |
| `[FRAME876]` | 1 | 1 | 1 |
| `[FRAME877]` | 1 | 1 | 1 |
| `[FRAME878]` | 1 | 1 | 1 |
| `[FRAME879]` | 1 | 1 | 1 |
| `[FRAME880]` | 1 | 1 | 1 |
| `[FRAME881]` | 1 | 1 | 1 |
| `[FRAME882]` | 1 | 1 | 1 |
| `[FRAME883]` | 1 | 1 | 1 |
| `[FRAME884]` | 1 | 1 | 1 |
| `[FRAME885]` | 1 | 1 | 1 |
| `[FRAME886]` | 1 | 1 | 1 |
| `[FRAME887]` | 1 | 1 | 1 |
| `[FRAME888]` | 1 | 1 | 1 |
| `[FRAME889]` | 1 | 1 | 1 |
| `[FRAME890]` | 1 | 1 | 1 |
| `[FRAME891]` | 1 | 1 | 1 |
| `[FRAME892]` | 1 | 1 | 1 |
| `[FRAME893]` | 1 | 1 | 1 |
| `[FRAME894]` | 1 | 1 | 1 |
| `[FRAME895]` | 1 | 1 | 1 |
| `[FRAME896]` | 1 | 1 | 1 |
| `[FRAME897]` | 1 | 1 | 1 |
| `[FRAME898]` | 1 | 1 | 1 |
| `[FRAME899]` | 1 | 1 | 1 |
| `[FRAME900]` | 1 | 1 | 1 |
| `[FRAME901]` | 1 | 1 | 1 |
| `[FRAME902]` | 1 | 1 | 1 |
| `[FRAME903]` | 1 | 1 | 1 |
| `[FRAME904]` | 1 | 1 | 1 |
| `[FRAME905]` | 1 | 1 | 1 |
| `[FRAME906]` | 1 | 1 | 1 |
| `[FRAME907]` | 1 | 1 | 1 |
| `[FRAME908]` | 1 | 1 | 1 |
| `[FRAME909]` | 1 | 1 | 1 |
| `[FRAME910]` | 1 | 1 | 1 |
| `[FRAME911]` | 1 | 1 | 1 |
| `[FRAME912]` | 1 | 1 | 1 |
| `[FRAME913]` | 1 | 1 | 1 |
| `[FRAME914]` | 1 | 1 | 1 |
| `[FRAME915]` | 1 | 1 | 1 |
| `[FRAME916]` | 1 | 1 | 1 |
| `[FRAME917]` | 1 | 1 | 1 |
| `[FRAME918]` | 1 | 1 | 1 |
| `[FRAME919]` | 1 | 1 | 1 |
| `[FRAME920]` | 1 | 1 | 1 |
| `[FRAME921]` | 1 | 1 | 1 |
| `[FRAME922]` | 1 | 1 | 1 |
| `[FRAME923]` | 1 | 1 | 1 |
| `[FRAME924]` | 1 | 1 | 1 |
| `[FRAME925]` | 1 | 1 | 1 |
| `[FRAME926]` | 1 | 1 | 1 |
| `[FRAME927]` | 1 | 1 | 1 |
| `[FRAME928]` | 1 | 1 | 1 |
| `[FRAME929]` | 1 | 1 | 1 |
| `[FRAME930]` | 1 | 1 | 1 |
| `[FRAME931]` | 1 | 1 | 1 |
| `[FRAME932]` | 1 | 1 | 1 |
| `[FRAME933]` | 1 | 1 | 1 |
| `[FRAME934]` | 1 | 1 | 1 |
| `[FRAME935]` | 1 | 1 | 1 |
| `[FRAME936]` | 1 | 1 | 1 |
| `[FRAME937]` | 1 | 1 | 1 |
| `[FRAME938]` | 1 | 1 | 1 |
| `[FRAME939]` | 1 | 1 | 1 |
| `[FRAME940]` | 1 | 1 | 1 |
| `[FRAME941]` | 1 | 1 | 1 |
| `[FRAME942]` | 1 | 1 | 1 |
| `[FRAME943]` | 1 | 1 | 1 |
| `[FRAME944]` | 1 | 1 | 1 |
| `[FRAME945]` | 1 | 1 | 1 |
| `[FRAME946]` | 1 | 1 | 1 |
| `[FRAME947]` | 1 | 1 | 1 |
| `[FRAME948]` | 1 | 1 | 1 |
| `[FRAME949]` | 1 | 1 | 1 |
| `[FRAME950]` | 1 | 1 | 1 |
| `[FRAME951]` | 1 | 1 | 1 |
| `[FRAME952]` | 1 | 1 | 1 |
| `[FRAME953]` | 1 | 1 | 1 |
| `[FRAME954]` | 1 | 1 | 1 |
| `[FRAME955]` | 1 | 1 | 1 |
| `[FRAME956]` | 1 | 1 | 1 |
| `[FRAME957]` | 1 | 1 | 1 |
| `[FRAME958]` | 1 | 1 | 1 |
| `[FRAME959]` | 1 | 1 | 1 |
| `[FRAME960]` | 1 | 1 | 1 |
| `[FRAME961]` | 1 | 1 | 1 |
| `[FRAME962]` | 1 | 1 | 1 |
| `[FRAME963]` | 1 | 1 | 1 |
| `[FRAME964]` | 1 | 1 | 1 |
| `[FRAME965]` | 1 | 1 | 1 |
| `[FRAME966]` | 1 | 1 | 1 |
| `[FRAME967]` | 1 | 1 | 1 |
| `[FRAME968]` | 1 | 1 | 1 |
| `[FRAME969]` | 1 | 1 | 1 |
| `[FRAME970]` | 1 | 1 | 1 |
| `[FRAME971]` | 1 | 1 | 1 |
| `[FRAME972]` | 1 | 1 | 1 |
| `[FRAME973]` | 1 | 1 | 1 |
| `[FRAME974]` | 1 | 1 | 1 |
| `[FRAME975]` | 1 | 1 | 1 |
| `[FRAME976]` | 1 | 1 | 1 |
| `[FRAME977]` | 1 | 1 | 1 |
| `[FRAME978]` | 1 | 1 | 1 |
| `[FRAME979]` | 1 | 1 | 1 |
| `[FRAME980]` | 1 | 1 | 1 |
| `[FRAME981]` | 1 | 1 | 1 |
| `[FRAME982]` | 1 | 1 | 1 |
| `[FRAME983]` | 1 | 1 | 1 |
| `[FRAME984]` | 1 | 1 | 1 |
| `[FRAME985]` | 1 | 1 | 1 |
| `[FRAME986]` | 1 | 1 | 1 |
| `[FRAME987]` | 1 | 1 | 1 |
| `[FRAME988]` | 1 | 1 | 1 |
| `[FRAME989]` | 1 | 1 | 1 |
| `[FRAME990]` | 1 | 1 | 1 |
| `[FRAME991]` | 1 | 1 | 1 |
| `[FRAME992]` | 1 | 1 | 1 |
| `[FRAME993]` | 1 | 1 | 1 |
| `[FRAME994]` | 1 | 1 | 1 |
| `[FRAME995]` | 1 | 1 | 1 |
| `[FRAME996]` | 1 | 1 | 1 |
| `[FRAME997]` | 1 | 1 | 1 |
| `[FRAME998]` | 1 | 1 | 1 |
| `[FRAME999]` | 1 | 1 | 1 |
| `[FRAME1000]` | 1 | 1 | 1 |
| `[FRAME1001]` | 1 | 1 | 1 |
| `[FRAME1002]` | 1 | 1 | 1 |
| `[FRAME1003]` | 1 | 1 | 1 |
| `[FRAME1004]` | 1 | 1 | 1 |
| `[FRAME1005]` | 1 | 1 | 1 |
| `[FRAME1006]` | 1 | 1 | 1 |
| `[FRAME1007]` | 1 | 1 | 1 |
| `[FRAME1008]` | 1 | 1 | 1 |
| `[FRAME1009]` | 1 | 1 | 1 |
| `[FRAME1010]` | 1 | 1 | 1 |
| `[FRAME1011]` | 1 | 1 | 1 |
| `[FRAME1012]` | 1 | 1 | 1 |
| `[FRAME1013]` | 1 | 1 | 1 |
| `[FRAME1014]` | 1 | 1 | 1 |
| `[FRAME1015]` | 1 | 1 | 1 |
| `[FRAME1016]` | 1 | 1 | 1 |
| `[FRAME1017]` | 1 | 1 | 1 |
| `[FRAME1018]` | 1 | 1 | 1 |
| `[FRAME1019]` | 1 | 1 | 1 |
| `[FRAME1020]` | 1 | 1 | 1 |
| `[FRAME1021]` | 1 | 1 | 1 |
| `[FRAME1022]` | 1 | 1 | 1 |
| `[FRAME1023]` | 1 | 1 | 1 |
| `[FRAME1024]` | 1 | 1 | 1 |
| `[FRAME1025]` | 1 | 1 | 1 |
| `[FRAME1026]` | 1 | 1 | 1 |
| `[FRAME1027]` | 1 | 1 | 1 |
| `[FRAME1028]` | 1 | 1 | 1 |
| `[FRAME1029]` | 1 | 1 | 1 |
| `[FRAME1030]` | 1 | 1 | 1 |
| `[FRAME1031]` | 1 | 1 | 1 |
| `[FRAME1032]` | 1 | 1 | 1 |
| `[FRAME1033]` | 1 | 1 | 1 |
| `[FRAME1034]` | 1 | 1 | 1 |
| `[FRAME1035]` | 1 | 1 | 1 |
| `[FRAME1036]` | 1 | 1 | 1 |
| `[FRAME1037]` | 1 | 1 | 1 |
| `[FRAME1038]` | 1 | 1 | 1 |
| `[FRAME1039]` | 1 | 1 | 1 |
| `[FRAME1040]` | 1 | 1 | 1 |
| `[FRAME1041]` | 1 | 1 | 1 |
| `[FRAME1042]` | 1 | 1 | 1 |
| `[FRAME1043]` | 1 | 1 | 1 |
| `[FRAME1044]` | 1 | 1 | 1 |
| `[FRAME1045]` | 1 | 1 | 1 |
| `[FRAME1046]` | 1 | 1 | 1 |
| `[FRAME1047]` | 1 | 1 | 1 |
| `[FRAME1048]` | 1 | 1 | 1 |
| `[FRAME1049]` | 1 | 1 | 1 |
| `[FRAME1050]` | 1 | 1 | 1 |
| `[FRAME1051]` | 1 | 1 | 1 |
| `[FRAME1052]` | 1 | 1 | 1 |
| `[FRAME1053]` | 1 | 1 | 1 |
| `[FRAME1054]` | 1 | 1 | 1 |
| `[FRAME1055]` | 1 | 1 | 1 |
| `[FRAME1056]` | 1 | 1 | 1 |
| `[FRAME1057]` | 1 | 1 | 1 |
| `[FRAME1058]` | 1 | 1 | 1 |
| `[FRAME1059]` | 1 | 1 | 1 |
| `[FRAME1060]` | 1 | 1 | 1 |
| `[FRAME1061]` | 1 | 1 | 1 |
| `[FRAME1062]` | 1 | 1 | 1 |
| `[FRAME1063]` | 1 | 1 | 1 |
| `[FRAME1064]` | 1 | 1 | 1 |
| `[FRAME1065]` | 1 | 1 | 1 |
| `[FRAME1066]` | 1 | 1 | 1 |
| `[FRAME1067]` | 1 | 1 | 1 |
| `[FRAME1068]` | 1 | 1 | 1 |
| `[FRAME1069]` | 1 | 1 | 1 |
| `[FRAME1070]` | 1 | 1 | 1 |
| `[FRAME1071]` | 1 | 1 | 1 |
| `[FRAME1072]` | 1 | 1 | 1 |
| `[FRAME1073]` | 1 | 1 | 1 |
| `[FRAME1074]` | 1 | 1 | 1 |
| `[FRAME1075]` | 1 | 1 | 1 |
| `[FRAME1076]` | 1 | 1 | 1 |
| `[FRAME1077]` | 1 | 1 | 1 |
| `[FRAME1078]` | 1 | 1 | 1 |
| `[FRAME1079]` | 1 | 1 | 1 |
| `[FRAME1080]` | 1 | 1 | 1 |
| `[FRAME1081]` | 1 | 1 | 1 |
| `[FRAME1082]` | 1 | 1 | 1 |
| `[FRAME1083]` | 1 | 1 | 1 |
| `[FRAME1084]` | 1 | 1 | 1 |
| `[FRAME1085]` | 1 | 1 | 1 |
| `[FRAME1086]` | 1 | 1 | 1 |
| `[FRAME1087]` | 1 | 1 | 1 |
| `[FRAME1088]` | 1 | 1 | 1 |
| `[FRAME1089]` | 1 | 1 | 1 |
| `[FRAME1090]` | 1 | 1 | 1 |
| `[FRAME1091]` | 1 | 1 | 1 |
| `[FRAME1092]` | 1 | 1 | 1 |
| `[FRAME1093]` | 1 | 1 | 1 |
| `[FRAME1094]` | 1 | 1 | 1 |
| `[FRAME1095]` | 1 | 1 | 1 |
| `[FRAME1096]` | 1 | 1 | 1 |
| `[FRAME1097]` | 1 | 1 | 1 |
| `[FRAME1098]` | 1 | 1 | 1 |
| `[FRAME1099]` | 1 | 1 | 1 |
| `[FRAME1100]` | 1 | 1 | 1 |
| `[FRAME1101]` | 1 | 1 | 1 |
| `[FRAME1102]` | 1 | 1 | 1 |
| `[FRAME1103]` | 1 | 1 | 1 |
| `[FRAME1104]` | 1 | 1 | 1 |
| `[FRAME1105]` | 1 | 1 | 1 |
| `[FRAME1106]` | 1 | 1 | 1 |
| `[FRAME1107]` | 1 | 1 | 1 |
| `[FRAME1108]` | 1 | 1 | 1 |
| `[FRAME1109]` | 1 | 1 | 1 |
| `[FRAME1110]` | 1 | 1 | 1 |
| `[FRAME1111]` | 1 | 1 | 1 |
| `[FRAME1112]` | 1 | 1 | 1 |
| `[FRAME1113]` | 1 | 1 | 1 |
| `[FRAME1114]` | 1 | 1 | 1 |
| `[FRAME1115]` | 1 | 1 | 1 |
| `[FRAME1116]` | 1 | 1 | 1 |
| `[FRAME1117]` | 1 | 1 | 1 |
| `[GRAPHIC EFFECT]` | 2 | 339361 | 30083 |
| `[IMAGE]` | 2 | 1046502 | 114288 |
| `[IMAGE POS]` | 2 | 1046502 | 114288 |
| `[IMAGE RATE]` | 2 | 302182 | 30161 |
| `[IMAGE ROTATE]` | 2 | 204958 | 18902 |
| `[INTERPOLATION]` | 2 | 61059 | 12838 |
| `[LOOP]` | 2 | 22452 | 22452 |
| `[LOOP END]` | 2 | 393 | 393 |
| `[LOOP START]` | 2 | 390 | 390 |
| `[OPERATION]` | 2 | 1263 | 1263 |
| `[PLAY SOUND]` | 2 | 1685 | 992 |
| `[RGBA]` | 2 | 388073 | 37127 |
| `[SET FLAG]` | 2 | 861 | 501 |
| `[SHADOW]` | 2 | 33977 | 33977 |
| `[SPECTRUM]` | 2 | 1378 | 1378 |
| `[SPECTRUM COLOR]` | 2 | 1378 | 1378 |
| `[SPECTRUM EFFECT]` | 2 | 1378 | 1378 |
| `[SPECTRUM LIFE TIME]` | 2 | 1378 | 1378 |
| `[SPECTRUM TERM]` | 2 | 1378 | 1378 |

