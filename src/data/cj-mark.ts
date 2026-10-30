// ─── The CJ mark ────────────────────────────────────────────────────
// The C and the J are Bodoni Moda Black Italic (Indestructible Type, OFL), set as outlines so no font
// loads. The J hangs under the C like a drop earring; a terracotta copy of both sits behind them,
// offset down and to the right. Everything is in one 224-unit square (viewBox "16 0 224 224").

export const CJ_VIEWBOX = "16 0 224 224";

/** Both letters are placed inside this group, then each by its own transform. */
export const CJ_GROUP = "translate(4 -2) scale(0.9)";

export const CJ_C = {
  transform: "translate(28.00 10.00) scale(0.09740) translate(-100.00 1520.00)",
  d: "M710 20Q527 20 389.5 -44.5Q252 -109 176.0 -228.0Q100 -347 100 -510Q100 -715 170.0 -897.5Q240 -1080 365.0 -1220.0Q490 -1360 655.0 -1440.0Q820 -1520 1010 -1520Q1148 -1520 1242.5 -1457.0Q1337 -1394 1394.5 -1283.5Q1452 -1173 1480 -1030H1476Q1451 -1162 1406.0 -1252.0Q1361 -1342 1306.0 -1397.0Q1251 -1452 1194.5 -1476.0Q1138 -1500 1090 -1500Q998 -1500 921.5 -1441.0Q845 -1382 784.0 -1283.0Q723 -1184 677.0 -1061.5Q631 -939 600.5 -809.5Q570 -680 555.0 -560.5Q540 -441 540 -350Q540 -258 553.0 -177.0Q566 -96 614.0 -46.0Q662 4 766 4Q870 4 974.0 -57.5Q1078 -119 1177.0 -226.0Q1276 -333 1366 -470H1370Q1290 -347 1191.5 -234.5Q1093 -122 973.0 -51.0Q853 20 710 20ZM1256 0 1074 -126Q1134 -176 1195.0 -243.0Q1256 -310 1318 -396L1366 -470H1370L1260 0ZM1476 -1030 1462 -1106Q1435 -1193 1408.5 -1252.5Q1382 -1312 1338 -1364L1582 -1500H1586L1480 -1030Z",
};

export const CJ_J = {
  transform: "translate(84.00 78.00) scale(0.10090) translate(64.00 1500.00)",
  d: "M338 61Q226 61 135.0 23.5Q44 -14 -10.0 -84.5Q-64 -155 -64 -255Q-64 -327 -29.5 -382.5Q5 -438 59.5 -469.0Q114 -500 175 -500Q230 -500 285.0 -471.5Q340 -443 376.5 -391.0Q413 -339 413 -268Q413 -205 378.5 -154.0Q344 -103 289.5 -73.0Q235 -43 175 -43Q114 -43 60.0 -73.0Q6 -103 -28.0 -151.5Q-62 -200 -62 -255H-60Q-59 -181 -30.0 -125.5Q-1 -70 47.0 -32.5Q95 5 153.0 23.5Q211 42 269 42Q326 42 379.5 -8.5Q433 -59 478.0 -153.5Q523 -248 554 -380L814 -1500H1242L982 -340Q926 -253 854.5 -180.0Q783 -107 700.5 -53.0Q618 1 526.5 31.0Q435 61 338 61ZM544 -1496V-1500H1442V-1496Z",
};

/** The shadow's offset inside the group, and the stroke widths (in each letter's font units) that
    keep a 7-unit gap clear between the letters and their shadow. */
export const CJ_ECHO = { dx: 9, dy: 9, gapC: 71.9, gapJ: 69.4 };

/** Where the J hangs from (the top of its stem), as a share of the square: the swing's pivot. */
export const CJ_PIVOT = { x: 0.719, y: 0.304 };
