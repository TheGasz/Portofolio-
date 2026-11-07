import * as k from "../iso/iso-kit.js";
import * as G from "../iso/lathe.js";
import { tubePieces, tubeSvg } from "../iso/tube.js";
import { DESK_HOTSPOTS } from "./deskModel.js";

export const VIEW_WIDTH = 920;
export const VIEW_HEIGHT = 560;

const DESK = { x: -178, y: -92, w: 356, d: 204, r: 10 };
const DESK_H = 12;
const LEG_H = 16;

const WALL = { x: -178, y: -100, w: 356, d: 8, r: 3 };
const WALL_TOP = 172;
const WALL_FACE_Y = WALL.y + WALL.d; // -92

// Projection fitted to encompass the full desk, legs, and back wall.
export const P = k.fitProjection(
  [
    ...k.boxCorners(DESK, -DESK_H - LEG_H, 0),
    ...k.boxCorners(WALL, 0, WALL_TOP),
  ],
  VIEW_WIDTH,
  VIEW_HEIGHT,
  { pad: 26, azimuth: 52, elevation: 29 }
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) =>
  [...points].sort(
    (a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P)
  );

function mergeSlabs(slabs) {
  return {
    fill: slabs.map((s) => s.fill || "").join(""),
    shades: [0, 1, 2, 3].map((i) =>
      slabs.map((s) => s.shades[i] || "").join("")
    ),
    top: slabs.map((s) => s.top || "").join(""),
    crease: slabs.map((s) => s.crease || "").join(""),
    bevel: slabs.map((s) => s.bevel || "").join(""),
    outline: slabs.map((s) => s.outline || "").join(""),
  };
}

const planeOfY = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r = 3, steps = 6) =>
  k.pathOf(
    k
      .roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps)
      .map(([u, z]) => [u, -z]),
    true
  );

let clipCounter = 0;
function recessedWindow(
  { x0, x1, z0, z1, r, depth },
  yFace,
  backContent = "",
  backClass = "desk-well",
  insideContent = ""
) {
  const id = `desk-clip-${++clipCounter}`;
  const ring = k.roundedPlan(
    { x: x0, y: z0, w: x1 - x0, d: z1 - z0, r },
    6
  );
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = k.cameraOf(P);
  const tops = [];
  const sides = [[], [], [], []];

  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length];
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) {
      [nx, nz] = [-nx, -nz];
    }
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf(
      [
        at([ax, yFace, az]),
        at([bx, yFace, bz]),
        at([bx, yFace - depth, bz]),
        at([ax, yFace - depth, az]),
      ],
      true
    );
    if (nz >= nx) {
      tops.push(quad);
    } else {
      const shadeIdx = Math.min(
        3,
        Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4))
      );
      sides[shadeIdx].push(quad);
    }
  });

  const shape = flatRect(x0, z0, x1, z1, r);
  return [
    `<clipPath id="${id}"><path transform="${planeOfY(yFace)}" d="${shape}"/></clipPath>`,
    `<g clip-path="url(#${id})">`,
    `<path class="iso-top" d="${tops.join("")}"/>`,
    ...sides.map((d, shade) =>
      d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d.join("")}"/>` : ""
    ),
    `<g transform="${planeOfY(yFace - depth)}"><path class="${backClass}" d="${shape}"/>${backContent}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    insideContent,
    `</g>`,
    `<g transform="${planeOfY(yFace)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join("");
}

/**
 * 1. Static Desk Plate, Stepped Legs, Ruler Strip & Architectural Back Wall
 */
function buildDeskAndWall() {
  const out = [];

  // Soft shadow halo under the entire desk
  out.push(
    `<path class="iso-halo" d="${k.haloOf(DESK, -DESK_H - LEG_H, DESK_H, P)}"/>`
  );

  // 4 Stepped cylindrical desk legs sorted back-to-front
  for (const [lx, ly] of byDepth(k.corners(DESK, 22))) {
    out.push(
      S(k.cylinder(lx, ly, 8.5, -DESK_H - LEG_H, 2.4, P, 28), { tone: "lo" })
    );
    out.push(
      S(
        k.cylinder(lx, ly, 6.2, -DESK_H - LEG_H + 2.4, LEG_H - 2.4, P, 28),
        { tone: "mid" }
      )
    );
  }

  // Main Desk Top Slab
  const deskSeam = k.sideSeam(DESK, -4, P, 8);
  out.push(
    S(k.slabOf(DESK, -DESK_H, DESK_H, P, 8, 1.8), {
      tone: "mid",
      inner: L(deskSeam, { tone: "faint" }),
    })
  );

  // Inset precision groove on desk top
  out.push(L(k.planOutline(k.insetPlan(DESK, 5.5), 0, P, 8), { tone: "lo" }));

  // 4 Corner mounting screws with rings
  const deskScrews = k.corners(DESK, 11);
  out.push(
    L(deskScrews.map(([sx, sy]) => k.ring(sx, sy, 2.4, 0, P, 16)).join(""), {
      tone: "lo",
    })
  );
  out.push(D(deskScrews.map(([sx, sy]) => at([sx, sy, 0])), { size: 0.55 }));

  // Front Precision Ruler Strip along the front edge of the desk
  const ruler = { x: -148, y: DESK.y + DESK.d - 14, w: 224, d: 7, r: 1.2 };
  out.push(S(k.slabOf(ruler, 0, 0.7, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(
    ruler.x + 6,
    ruler.x + ruler.w - 6,
    4,
    5,
    ruler.y + 0.8,
    0.7,
    [2.2, 4.0],
    P
  );
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));

  // Engraved Brass Nameplate on the front-right corner of the desk
  const plate = { x: 92, y: DESK.y + DESK.d - 15, w: 62, d: 8.5, r: 1.4 };
  out.push(S(k.slabOf(plate, 0, 0.9, P, 3), { tone: "mid", crease: "none" }));
  out.push(
    L(
      [42, 30]
        .map((w, i) =>
          k.lineOnTop(
            [plate.x + 5, plate.y + 2.8 + i * 2.8],
            [plate.x + 5 + w, plate.y + 2.8 + i * 2.8],
            0.9,
            P
          )
        )
        .join(""),
      { tone: "lo", free: true }
    )
  );
  out.push(
    D(
      [
        at([plate.x + 2.5, plate.y + plate.d / 2, 0.9]),
        at([plate.x + plate.w - 2.5, plate.y + plate.d / 2, 0.9]),
      ],
      { size: 0.45 }
    )
  );

  // Architectural Back Wall Board behind the desk
  const wallSeam = k.sideSeam(WALL, 44, P, 4);
  out.push(
    S(k.slabOf(WALL, 0, WALL_TOP, P, 4, 1.2), {
      tone: "lo",
      inner: L(wallSeam, { tone: "faint" }),
    })
  );

  // Wall wainscoting rail & top pegboard dots
  const rail = { x: WALL.x, y: WALL_FACE_Y, w: WALL.w, d: 2.2, r: 0.8 };
  out.push(S(k.slabOf(rail, 42, 3.2, P, 3, 0.4), { tone: "mid" }));
  const wallStuds = [-164, -82, 0, 82, 164].map((wx) =>
    at([wx, WALL_FACE_Y, WALL_TOP - 8])
  );
  out.push(D(wallStuds, { size: 0.55, tone: "mid" }));

  return `<g class="desk-base" data-part="desk-base">${out.join("")}</g>`;
}

/**
 * 2. [02] Wall Portrait Frame ("About Me" Hotspot) — Back Wall Left
 */
function buildWallPhoto(photoHref) {
  const out = [];
  const FRAME = { x: -156, y: WALL_FACE_Y, w: 84, d: 5.5, r: 3 };
  const Z0 = 60;
  const H = 92;
  const FRONT_Y = FRAME.y + FRAME.d; // -86.5

  // Soft shadow halo on the wall
  out.push(`<path class="iso-halo" d="${k.haloOf(FRAME, Z0 - 2, H, P)}"/>`);

  // Outer Gallery Frame Slab
  out.push(
    S(k.slabOf(FRAME, Z0, H, P, 5, 1.0), {
      tone: "hi",
      className: "hotspot-primary",
    })
  );

  // Recessed Polaroid Mat & Real Portrait Image
  const PHOTO_WELL = {
    x0: FRAME.x + 6,
    x1: FRAME.x + FRAME.w - 6,
    z0: Z0 + 18,
    z1: Z0 + H - 6,
    r: 2,
    depth: 2.2,
  };
  const imgW = PHOTO_WELL.x1 - PHOTO_WELL.x0;
  const imgH = PHOTO_WELL.z1 - PHOTO_WELL.z0;

  // In planeOfY, u is +x and v is -z, so top-left of [x0..x1, z0..z1] is (x0, -z1)
  const imageMarkup = photoHref
    ? `<image href="${photoHref}" x="${PHOTO_WELL.x0}" y="${-PHOTO_WELL.z1}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid slice" class="desk-wall-photo"/>`
    : "";

  // Subtle corner photo mounts + portrait silhouette fallback lines
  const mountLines = [
    `M${PHOTO_WELL.x0 + 3} ${-(PHOTO_WELL.z1 - 8)}L${PHOTO_WELL.x0 + 8} ${-(PHOTO_WELL.z1 - 3)}`,
    `M${PHOTO_WELL.x1 - 8} ${-(PHOTO_WELL.z1 - 3)}L${PHOTO_WELL.x1 - 3} ${-(PHOTO_WELL.z1 - 8)}`,
  ].join("");

  out.push(
    recessedWindow(
      PHOTO_WELL,
      FRONT_Y,
      `${imageMarkup}<path class="iso-line" data-tone="lo" d="${mountLines}"/>`,
      "desk-photo-well"
    )
  );

  // Polaroid bottom caption lines on the frame face
  const captionLines = [
    `M${FRAME.x + 10} ${-(Z0 + 11)}H${FRAME.x + 54}`,
    `M${FRAME.x + 10} ${-(Z0 + 7)}H${FRAME.x + 38}`,
  ].join("");
  out.push(
    `<g transform="${planeOfY(FRONT_Y)}">${L(captionLines, {
      tone: "mid",
      free: true,
    })}<text class="iso-face-text" data-tone="hi" x="${FRAME.x + 58}" y="${-(Z0 + 7.5)}" font-size="4.2">ABOUT</text></g>`
  );

  // Yellow Masking Tape Strip at top center of the frame
  const TAPE = { x: FRAME.x + 26, y: FRAME.y + 1, w: 32, d: 5, r: 1 };
  out.push(
    S(k.slabOf(TAPE, Z0 + H - 2, 6, P, 3, 0.3), {
      tone: "mid",
      lit: true,
      className: "desk-tape-accent",
    })
  );

  // Small brass gallery label plaque under the portrait frame
  const PLAQUE = { x: FRAME.x + 18, y: WALL_FACE_Y, w: 48, d: 2.4, r: 1 };
  out.push(S(k.slabOf(PLAQUE, Z0 - 9, 5, P, 3), { tone: "lo" }));
  out.push(
    D(
      [
        at([PLAQUE.x + 3, WALL_FACE_Y + 2.4, Z0 - 6.5]),
        at([PLAQUE.x + PLAQUE.w - 3, WALL_FACE_Y + 2.4, Z0 - 6.5]),
      ],
      { size: 0.4 }
    )
  );

  return out.join("");
}

/**
 * 3. [05] Trophy & 7 Certificates Wall Shelf ("Credentials" Hotspot) — Back Wall Right
 */
function buildTrophyShelf() {
  const out = [];
  const SHELF = { x: 54, y: WALL_FACE_Y, w: 110, d: 28, r: 3 };
  const SHELF_Z = 82;
  const SHELF_H = 4.5;
  const TOP_Z = SHELF_Z + SHELF_H; // 86.5

  // 2 Under-shelf support brackets
  for (const bx of [66, 148]) {
    out.push(
      S(
        k.slabOf(
          { x: bx, y: WALL_FACE_Y, w: 4.5, d: 22, r: 1 },
          SHELF_Z - 12,
          12,
          P,
          3,
          0.4
        ),
        { tone: "lo" }
      )
    );
  }

  // Main Shelf Slab
  out.push(
    S(k.slabOf(SHELF, SHELF_Z, SHELF_H, P, 5, 0.8), {
      tone: "mid",
    })
  );
  out.push(
    L(k.planOutline(k.insetPlan(SHELF, 2.5), TOP_Z, P, 4), { tone: "faint" })
  );

  // Bookend on the left of the shelf
  out.push(
    S(
      k.slabOf(
        { x: 60, y: WALL_FACE_Y + 4, w: 3.5, d: 20, r: 1 },
        TOP_Z,
        24,
        P,
        3,
        0.4
      ),
      { tone: "lo" }
    )
  );

  // 7 Certificate Folios / Bound Volumes (representing all 7 verified certificates)
  const certHeights = [34, 36, 33, 37, 35, 38, 36];
  certHeights.forEach((ch, idx) => {
    const cx = 64 + idx * 6.2;
    const folio = { x: cx, y: WALL_FACE_Y + 3.5, w: 5.4, d: 21, r: 1 };
    const isAward = idx === 4 || idx === 5;
    const seam = k.sideSeam(folio, TOP_Z + ch - 6, P, 3);
    out.push(
      S(k.slabOf(folio, TOP_Z, ch, P, 3, 0.3), {
        tone: isAward ? "hi" : "mid",
        lit: isAward,
        inner: L(seam, { tone: "faint" }),
      })
    );
    // Spine seal dot
    out.push(
      D([at([cx + 2.7, folio.y + folio.d, TOP_Z + 9])], {
        size: 0.45,
        tone: isAward ? "hi" : "mid",
      })
    );
  });

  // Championship Trophy ("1st Runner Up") on the right side of the shelf
  const TX = 138;
  const TY = WALL_FACE_Y + 14;
  const plinth = { x: TX - 11, y: TY - 11, w: 22, d: 22, r: 3 };
  out.push(
    S(k.slabOf(plinth, TOP_Z, 8, P, 4, 0.6), {
      tone: "lo",
    })
  );
  // Brass plate on front of trophy plinth
  out.push(
    S(
      k.slabOf(
        { x: TX - 7, y: TY + 10.5, w: 14, d: 1, r: 0.4 },
        TOP_Z + 2,
        4,
        P,
        2
      ),
      { tone: "hi", lit: true }
    )
  );

  // Turned Trophy Pedestal & Cup via lathe.js
  const trophyFrame = G.frameOf([TX, TY, TOP_Z + 8], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const trophyProfile = [
    [0, 7.5],
    [2.5, 7.5],
    [4, 3.2, 1],
    [12, 2.4, 1],
    [16, 4.2, 1],
    [19, 8.8, 1],
    [32, 11.2, 1],
    [35, 11.8],
  ];
  const cupPaths = G.solidOf(trophyProfile, trophyFrame, P, {
    bevel: 0.5,
  });
  const cupSeam = G.arcOf(trophyFrame, 16, 4.2, P);
  out.push(
    S(cupPaths, {
      tone: "hi",
      lit: true,
      className: "hotspot-primary",
      inner: L(cupSeam, { tone: "lo" }),
    })
  );

  // Trophy Top Rim Ring
  out.push(L(k.ring(TX, TY, 9.2, TOP_Z + 43, P, 28), { tone: "lo" }));

  return out.join("");
}

/**
 * 4. [04] Open Lab Notebook & Technical Pen ("Skills" Hotspot) — Desk Left
 */
function buildNotebookAndPen() {
  const out = [];
  const COVER = { x: -162, y: 8, w: 86, d: 64, r: 3.5 };

  // Soft shadow halo under notebook
  out.push(`<path class="iso-halo" d="${k.haloOf(COVER, 0, 5, P)}"/>`);

  // Hardcover Base
  out.push(S(k.slabOf(COVER, 0, 2.2, P, 5, 0.5), { tone: "lo" }));

  // Left Page Stack & Right Page Stack
  const LEFT_PAGE = { x: -159, y: 10.5, w: 39, d: 59, r: 1.8 };
  const RIGHT_PAGE = { x: -118, y: 10.5, w: 39, d: 59, r: 1.8 };
  const PAGE_TOP = 5.4;

  out.push(
    S(k.slabOf(LEFT_PAGE, 2.2, 3.2, P, 4, 0.4), {
      tone: "hi",
      className: "hotspot-primary",
    })
  );
  out.push(
    S(k.slabOf(RIGHT_PAGE, 2.2, 3.2, P, 4, 0.4), {
      tone: "hi",
      className: "hotspot-primary",
    })
  );

  // Center Spine Binding Rings
  const spineRings = Array.from({ length: 8 }, (_, i) =>
    at([-119, 15 + i * 7, PAGE_TOP + 0.3])
  );
  out.push(D(spineRings, { size: 0.55, tone: "mid" }));

  // Left Page: Engraved Coordinate Axes & Model Loss/Validation Curve
  const axX0 = -153;
  const axX1 = -125;
  const axY0 = 20;
  const axY1 = 44;
  const axesPath =
    k.lineOnTop([axX0, axY0], [axX0, axY1], PAGE_TOP, P) +
    k.lineOnTop([axX0, axY1], [axX1, axY1], PAGE_TOP, P);
  out.push(L(axesPath, { tone: "mid" }));

  // Curve plotted on the left page
  const curvePts = [
    [axX0 + 2, axY1 - 3],
    [axX0 + 8, axY1 - 12],
    [axX0 + 15, axY1 - 10],
    [axX0 + 21, axY1 - 19],
    [axX0 + 26, axY1 - 21],
  ];
  out.push(L(k.onTop(curvePts, PAGE_TOP, P, false), { tone: "lit", free: true }));
  out.push(
    D(
      curvePts.map(([px, py]) => at([px, py, PAGE_TOP])),
      { size: 0.45, tone: "hi" }
    )
  );

  // Left page bottom rule lines
  const leftRules = [26, 20, 24]
    .map((w, i) =>
      k.lineOnTop(
        [-153, 50 + i * 5],
        [-153 + w, 50 + i * 5],
        PAGE_TOP,
        P
      )
    )
    .join("");
  out.push(L(leftRules, { tone: "lo", free: true }));

  // Right Page: 5 Skill Engineering Rows + Engraved "SKILLS" header
  out.push(
    k.faceTextSvg(k.topMatrix([-112, 18], PAGE_TOP, P, "x"), "01 / SKILLS", {
      size: 4.2,
      tone: "hi",
    })
  );
  const rightRules = [28, 25, 29, 22, 26]
    .map((w, i) =>
      k.lineOnTop(
        [-112, 26 + i * 7.5],
        [-112 + w, 26 + i * 7.5],
        PAGE_TOP,
        P
      )
    )
    .join("");
  out.push(L(rightRules, { tone: "lo", free: true }));
  const rightDots = [0, 1, 2, 3, 4].map((i) =>
    at([-114.5, 26 + i * 7.5, PAGE_TOP])
  );
  out.push(D(rightDots, { size: 0.5, tone: "hi" }));

  // Bookmark Ribbon Tab sticking out of the front of the notebook
  const TAB = { x: -116, y: 71, w: 9, d: 8, r: 1.2 };
  out.push(
    S(k.slabOf(TAB, 0.5, 1.8, P, 3, 0.2), {
      tone: "hi",
      lit: true,
    })
  );

  // Technical Drafting Pen resting in front of the notebook
  const penFrame = G.frameOf([-152, 82, 2.4], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const penProfile = [
    [0, 1.8],
    [48, 1.8],
    [54, 0.9, 1],
    [58, 0.2],
  ];
  out.push(
    S(G.solidOf(penProfile, penFrame, P), {
      tone: "mid",
      inner: L(G.arcOf(penFrame, 38, 1.8, P), { tone: "lo" }),
    })
  );

  return out.join("");
}

/**
 * 5. [01] Desktop PC & Monitor ("Projects" Hotspot) — Desk Center
 */
function buildComputerAndMonitor() {
  const out = [];

  // Desktop PC Base Unit (Horizontal Workstation Chassis under the Monitor)
  const PC = { x: -58, y: -74, w: 116, d: 80, r: 6 };
  const PC_PLINTH = 3;
  const PC_TOP = 24;
  const PC_FRONT = PC.y + PC.d; // +6
  const PC_SIDE = PC.x + PC.w; // +58

  out.push(`<path class="iso-halo" d="${k.haloOf(PC, 0, 8, P)}"/>`);
  out.push(
    S(k.slabOf(k.insetPlan(PC, 3), 0, PC_PLINTH, P, 6), { tone: "lo" })
  );

  const pcSeam = k.sideSeam(PC, 14, P, 6);
  out.push(
    S(k.slabOf(PC, PC_PLINTH, PC_TOP - PC_PLINTH, P, 6, 1.2), {
      tone: "mid",
      inner: L(pcSeam, { tone: "faint" }),
    })
  );

  // Front Bezel Outline, Optical/Disk Slot & Status LEDs on PC Front (y = PC_FRONT)
  const DRIVE_SLOT = { x0: 8, x1: 46, z0: 11, z1: 16.5, r: 1.5, depth: 3.5 };
  out.push(
    recessedWindow(
      DRIVE_SLOT,
      PC_FRONT,
      `<path class="iso-line" data-tone="lo" d="M${DRIVE_SLOT.x0} ${-(DRIVE_SLOT.z0 + 2.5)}H${DRIVE_SLOT.x1}"/>`,
      "desk-dark-well"
    )
  );
  // PC Front Vent Grilles
  const pcFrontVents = Array.from({ length: 8 }, (_, i) =>
    flatRect(-46 + i * 4.2, 8, -44 + i * 4.2, 18, 0.6, 4)
  ).join("");
  out.push(
    `<g transform="${planeOfY(PC_FRONT)}">${L(pcFrontVents, { tone: "lo" })}</g>`
  );
  // Power & Disk LEDs on PC Front
  out.push(
    D([at([-6, PC_FRONT, 14]), at([0, PC_FRONT, 14])], {
      size: 0.75,
      tone: "hi",
      pulse: true,
    })
  );

  // Side I/O Port on PC right face (for Keyboard & Mouse cords)
  out.push(
    S(
      k.slabOf(
        { x: PC_SIDE, y: -22, w: 3.5, d: 14, r: 1.2 },
        6,
        8,
        P,
        3,
        0.3
      ),
      { tone: "lo" }
    )
  );

  // Monitor Swivel Turntable & Pedestal Neck on top of PC
  out.push(S(k.cylinder(0, -34, 18, PC_TOP, 3.2, P, 36, 0.5), { tone: "lo" }));
  out.push(
    S(k.cylinder(0, -34, 9.5, PC_TOP + 3.2, 9.8, P, 32), {
      tone: "mid",
      crease: "none",
    })
  );
  out.push(L(k.sideArc(0, -34, 9.5, PC_TOP + 8, P, 20), { tone: "faint" }));

  // Main Monitor Housing
  const MON = { x: -54, y: -64, w: 108, d: 64, r: 7 };
  const MON_Z0 = 36;
  const MON_H = 88;
  const MON_TOP = MON_Z0 + MON_H; // 124
  const MON_FRONT = MON.y + MON.d; // 0

  const monSeam = k.sideSeam(MON, MON_Z0 + 10, P, 7);
  out.push(
    S(k.slabOf(MON, MON_Z0, MON_H, P, 7, 1.6), {
      tone: "hi",
      className: "hotspot-primary",
      inner: L(monSeam, { tone: "faint" }),
    })
  );

  // Top Cooling Vent Slots on Monitor
  const topVents = Array.from({ length: 6 }, (_, i) =>
    k.planOutline(
      { x: -32, y: MON.y + 14 + i * 4.2, w: 64, d: 1.6, r: 0.7 },
      MON_TOP,
      P,
      4
    )
  ).join("");
  out.push(L(topVents, { tone: "faint" }));

  // Recessed Outer Bezel & Inner CRT/LCD Screen on Monitor Front (y = MON_FRONT)
  const BEZEL = {
    x0: -46,
    x1: 46,
    z0: MON_Z0 + 8,
    z1: MON_TOP - 7,
    r: 5,
    depth: 2.0,
  };
  const SCREEN = {
    x0: -41,
    x1: 41,
    z0: MON_Z0 + 13,
    z1: MON_TOP - 11,
    r: 6,
    depth: 4.2,
  };

  // Screen dashboard graphics in screen plane
  const scanLines = [];
  for (let z = SCREEN.z0 + 2; z < SCREEN.z1; z += 2.4) {
    scanLines.push(`M${SCREEN.x0} ${(-z).toFixed(1)}H${SCREEN.x1}`);
  }
  const screenGlow = flatRect(
    SCREEN.x0 + 5,
    SCREEN.z0 + 5,
    SCREEN.x1 - 5,
    SCREEN.z1 - 5,
    14,
    8
  );

  // 3 Mini Project Cards / Metric Bars inside the Monitor Screen
  const card1 = flatRect(-36, 86, -14, 102, 1.8, 4);
  const card2 = flatRect(-11, 86, 11, 102, 1.8, 4);
  const card3 = flatRect(14, 86, 36, 102, 1.8, 4);

  // Rising telemetry waveform inside the Monitor Screen
  const wavePath = `M-35 -74 L-24 -78 L-14 -75 L-3 -82 L8 -79 L19 -84 L34 -81`;

  const screenContent = [
    `<path class="desk-screen-glow" d="${screenGlow}"/>`,
    `<path class="desk-screen-scan" d="${scanLines.join("")}"/>`,
    `<path class="desk-screen-card" d="${card1}${card2}${card3}"/>`,
    `<path class="iso-line" data-tone="lit" d="${wavePath}"/>`,
    `<text class="desk-screen-title" x="-36" y="-105" font-size="4.4">PORTFOLIO // 11 PROJECTS</text>`,
    `<text class="desk-screen-sub" x="-36" y="-64" font-size="4.0">&gt; CLICK MONITOR TO OPEN</text>`,
    `<rect class="desk-screen-cursor" x="22" y="-68" width="2.8" height="4.4"/>`,
  ].join("");

  out.push(
    recessedWindow(
      BEZEL,
      MON_FRONT,
      "",
      "desk-bezel-well",
      recessedWindow(SCREEN, MON_FRONT - BEZEL.depth, screenContent, "desk-screen-glass")
    )
  );

  // Monitor Power Indicator LED
  out.push(
    D([at([38, MON_FRONT, MON_Z0 + 4.2])], {
      size: 0.85,
      tone: "hi",
      pulse: true,
    })
  );

  return out.join("");
}

/**
 * 6. Mechanical Keyboard, Coiled Cord, Stitched Mousepad & 3D Ergonomic Mouse
 *    (Visually part of the central Workstation on the Desk)
 */
const KB_ROWS = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2],
  [2.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.8],
  [1.5, 1.5, 1.5, 6.5, 1.5, 1.5],
];
const KB_ROW_H = [4.6, 4.3, 4.0, 3.7, 3.5];

function buildKeyboardAndMouse() {
  const out = [];

  // Coiled Cable connecting PC Side Port to Keyboard
  const kbCoil = k.coil(-16, 18, [64, 3.2], 2.8, 13, "y", P);
  out.push(L(kbCoil.back, { tone: "lo" }), L(kbCoil.front, { tone: "mid" }));

  // Mechanical Keyboard Chassis (Center-Front of Desk)
  const KB = { x: -66, y: 20, w: 112, d: 46, r: 4 };
  const KB_Z = 1.4;
  const KB_TOP = 7.2;
  const U = 7.4;
  const KEYS_X = KB.x + 5;
  const KEYS_Y = KB.y + 5.5;

  out.push(`<path class="iso-halo" d="${k.haloOf(KB, 0, 4, P)}"/>`);
  for (const [fx, fy] of byDepth(k.corners(KB, 6))) {
    out.push(S(k.cylinder(fx, fy, 2.4, 0, KB_Z, P, 14), { tone: "lo" }));
  }
  out.push(S(k.slabOf(KB, KB_Z, KB_TOP - KB_Z, P, 5, 0.9), { tone: "mid" }));

  // Key Well Outline & Status LEDs
  const well = {
    x: KEYS_X - 1.2,
    y: KEYS_Y - 1.2,
    w: U * 14 + 2.4,
    d: U * 5 + 1.2,
    r: 1.8,
  };
  out.push(L(k.planOutline(well, KB_TOP, P, 4), { tone: "lo" }));
  out.push(
    D(
      [
        at([KB.x + KB.w - 14, KB.y + 3, KB_TOP]),
        at([KB.x + KB.w - 10, KB.y + 3, KB_TOP]),
        at([KB.x + KB.w - 6, KB.y + 3, KB_TOP]),
      ],
      { size: 0.45, tone: "hi" }
    )
  );

  // 5 Rows of Sculpted 3D Keycaps (batched into merged SVG paths for fast DOM traversal)
  const regularCaps = [];
  const shortcutCaps = [];
  const litCaps = [];
  const allDishes = [];

  KB_ROWS.forEach((row, rIdx) => {
    let x = KEYS_X;
    row.forEach((widthUnits, cIdx) => {
      const plan = {
        x: x + 0.55,
        y: KEYS_Y + rIdx * U + 0.55,
        w: widthUnits * U - 1.1,
        d: U - 1.3,
        r: 1.1,
      };
      const kh = KB_ROW_H[rIdx];
      const slab = k.slabOf(plan, KB_TOP, kh, P, 3, 0.35);
      allDishes.push(k.planOutline(k.insetPlan(plan, 1.3), KB_TOP + kh, P, 3));

      if (rIdx === 0 && cIdx === 0) {
        litCaps.push(slab);
      } else if (
        (rIdx === 0 && cIdx >= 1 && cIdx <= 5) ||
        (rIdx === 2 && cIdx === row.length - 1)
      ) {
        shortcutCaps.push(slab);
      } else {
        regularCaps.push(slab);
      }
      x += widthUnits * U;
    });
  });

  if (regularCaps.length) {
    out.push(
      S(mergeSlabs(regularCaps), {
        tone: "mid",
        crease: "faint",
        inner: L(allDishes.join(""), { tone: "faint" }),
      })
    );
  }
  if (shortcutCaps.length) {
    out.push(S(mergeSlabs(shortcutCaps), { tone: "hi", crease: "faint" }));
  }
  if (litCaps.length) {
    out.push(S(mergeSlabs(litCaps), { tone: "hi", lit: true, crease: "faint" }));
  }

  // Stitched Mousepad (to the right of the keyboard)
  const PAD = { x: 54, y: 22, w: 44, d: 44, r: 3.5 };
  out.push(S(k.slabOf(PAD, 0, 1.2, P, 5, 0.3), { tone: "lo" }));
  out.push(
    L(k.planOutline(k.insetPlan(PAD, 2.2), 1.2, P, 4), {
      tone: "faint",
      dashed: true,
    })
  );

  // Mouse Cord (3D tube from Mouse back to PC side port)
  const mouseRoute = G.fillet(
    [
      [76, 33, 2.6],
      [76, 14, 2.2],
      [68, 2, 2.4],
      [61.5, -14, 9.5],
    ],
    4,
    6,
    { P, tube: 0.9 }
  );
  for (const piece of tubePieces(mouseRoute, 0.9, P, { maxLength: 24 })) {
    out.push(tubeSvg(piece, { tone: "mid" }));
  }

  // Ergonomic 3D Mouse Body on the Mousepad
  const MOUSE = { x: 66, y: 33, w: 20, d: 26, r: 6 };
  out.push(`<path class="iso-halo" d="${k.haloOf(MOUSE, 1.2, 6, P)}"/>`);
  const mouseSeam =
    k.lineOnTop([66.5, 43], [85.5, 43], 7.4, P) +
    k.lineOnTop([76, 33.5], [76, 43], 7.4, P);
  out.push(
    S(k.slabOf(MOUSE, 1.2, 6.2, P, 6, 0.8), {
      tone: "hi",
      inner: L(mouseSeam, { tone: "lo" }),
    })
  );

  // Scroll Wheel on the Mouse
  const WHEEL = { x: 74.8, y: 35.5, w: 2.4, d: 5.2, r: 0.9 };
  out.push(
    S(k.slabOf(WHEEL, 7.4, 1.4, P, 3, 0.2), {
      tone: "mid",
      lit: true,
    })
  );

  return `<g class="desk-input-gear" data-part="keyboard-mouse">${out.join("")}</g>`;
}

/**
 * 7. [03] Desk Telephone & Coiled Cord ("Contact Me" Hotspot) — Desk Right
 */
function buildDeskPhone() {
  const out = [];
  const PHONE = { x: 108, y: 2, w: 54, d: 62, r: 5 };
  const BASE_Z = 1.4;
  const BASE_H = 12.6;
  const BASE_TOP = BASE_Z + BASE_H; // 14

  out.push(`<path class="iso-halo" d="${k.haloOf(PHONE, 0, 8, P)}"/>`);

  // 4 Rubber feet
  for (const [fx, fy] of byDepth(k.corners(PHONE, 6))) {
    out.push(S(k.cylinder(fx, fy, 2.6, 0, BASE_Z, P, 14), { tone: "lo" }));
  }

  // Coiled Handset Cord on the left side of the phone
  const phoneCoil = k.coil(12, 48, [104, 5.2], 3.0, 14, "y", P);
  out.push(
    L(phoneCoil.back, { tone: "lo" }),
    L(phoneCoil.front, { tone: "mid" })
  );

  // Main Phone Console Base
  const phoneSeam = k.sideSeam(PHONE, 7.5, P, 5);
  out.push(
    S(k.slabOf(PHONE, BASE_Z, BASE_H, P, 5, 1.1), {
      tone: "hi",
      className: "hotspot-primary",
      inner: L(phoneSeam, { tone: "faint" }),
    })
  );

  // Caller-ID Display Strip & Pulsing Ring LED on the Phone Face
  const lcd = { x: 126, y: 20, w: 30, d: 8, r: 1.4 };
  out.push(S(k.slabOf(lcd, BASE_TOP, 0.8, P, 3), { tone: "lo" }));
  out.push(
    k.faceTextSvg(k.topMatrix([129, 25.5], BASE_TOP + 0.8, P, "x"), "CONTACT", {
      size: 3.6,
      tone: "hi",
    })
  );
  // Pulsing Ring Indicator LED
  out.push(
    D([at([156, 56, BASE_TOP + 0.4])], {
      size: 0.9,
      tone: "hi",
      pulse: true,
    })
  );

  // Speaker Grille Perforation Dots (bottom-left of phone face)
  out.push(
    D(k.dotGrid(114, 46, 4, 3, 2.6, BASE_TOP, P), {
      size: 0.42,
      tone: "mid",
    })
  );

  // 3x4 Tactile Numeric Keypad (12 sculpted buttons batched for fast DOM traversal)
  const KP_X = 128;
  const KP_Y = 31;
  const BW = 6.2;
  const BD = 5.0;
  const GAP = 1.8;
  const phoneMidBtns = [];
  const phoneHiBtns = [];
  const phoneLitBtns = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const btn = {
        x: KP_X + col * (BW + GAP),
        y: KP_Y + row * (BD + GAP),
        w: BW,
        d: BD,
        r: 1.0,
      };
      const slab = k.slabOf(btn, BASE_TOP, 2.4, P, 3, 0.3);
      if (row === 0 && col === 0) {
        phoneLitBtns.push(slab);
      } else if (row === 3 && col === 1) {
        phoneHiBtns.push(slab);
      } else {
        phoneMidBtns.push(slab);
      }
    }
  }
  if (phoneMidBtns.length) {
    out.push(S(mergeSlabs(phoneMidBtns), { tone: "mid", crease: "faint" }));
  }
  if (phoneHiBtns.length) {
    out.push(S(mergeSlabs(phoneHiBtns), { tone: "hi", crease: "faint" }));
  }
  if (phoneLitBtns.length) {
    out.push(S(mergeSlabs(phoneLitBtns), { tone: "mid", lit: true, crease: "faint" }));
  }

  // Cradle Plungers
  out.push(
    S(k.cylinder(117, 11, 2.4, BASE_TOP, 2.5, P, 16), { tone: "lo" }),
    S(k.cylinder(117, 52, 2.4, BASE_TOP, 2.5, P, 16), { tone: "lo" })
  );

  // Sculpted Telephone Handset resting along the left cradle (x = 111..123, y = 4..60)
  const EAR_BACK = { x: 111, y: 5, w: 12, d: 13, r: 3 };
  const EAR_FRONT = { x: 111, y: 46, w: 12, d: 13, r: 3 };
  const BAR = { x: 112.5, y: 8, w: 9, d: 48, r: 2.8 };

  out.push(
    S(k.slabOf(EAR_BACK, BASE_TOP + 2, 6.5, P, 4, 0.5), { tone: "mid" })
  );
  out.push(
    S(k.slabOf(EAR_FRONT, BASE_TOP + 2, 6.5, P, 4, 0.5), { tone: "mid" })
  );
  out.push(
    S(k.slabOf(BAR, BASE_TOP + 6, 5.5, P, 4, 0.7), {
      tone: "hi",
      lit: true,
      className: "desk-handset-bar",
    })
  );

  return out.join("");
}

const SCENE_CACHE = new Map();

/**
 * Build the complete precomputed workstation scene and 2D screen coordinates for all 5 hotspot pins.
 * Cached by `photoHref` so repeated mounts reuse the exact precomputed SVG strings in O(1).
 * @param {string} photoHref  Resolved URL/path to Bagas's portrait image (`profile.jpg`).
 */
export function buildDeskScene(photoHref = "") {
  const key = String(photoHref || "");
  if (SCENE_CACHE.has(key)) {
    return SCENE_CACHE.get(key);
  }

  const pins = {};
  for (const h of DESK_HOTSPOTS) {
    const [sx, sy] = at(h.pinWorld);
    pins[h.id] = { x: Math.round(sx * 10) / 10, y: Math.round(sy * 10) / 10 };
  }

  const scene = {
    viewBox: `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`,
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
    pins,
    layers: {
      deskAndWall: buildDeskAndWall(),
      photo: buildWallPhoto(key),
      trophy: buildTrophyShelf(),
      notebook: buildNotebookAndPen(),
      monitor: buildComputerAndMonitor(),
      keyboardAndMouse: buildKeyboardAndMouse(),
      phone: buildDeskPhone(),
    },
  };

  SCENE_CACHE.set(key, scene);
  return scene;
}

