import * as k from "../iso/iso-kit.js";
import * as G from "../iso/lathe.js";
import { tubePieces, tubeSvg } from "../iso/tube.js";
import { DESK_HOTSPOTS } from "./deskModel.js";

export const VIEW_WIDTH = 1600;
export const VIEW_HEIGHT = 900;

const CAMERA_BOUNDS = { x: -202, y: -88, w: 368, d: 148, r: 4 };
const ROOM_TOP = 168;
const FLOOR_Z = -112;

// Front-Facing Room POV ("POV Tampak Depan" — azimuth: 80°, elevation: 11°)
// zoomed in closer so left/right sides aren't empty while keeping full top/bottom clearance.
export const P = k.fitProjection(
  [
    ...k.boxCorners(CAMERA_BOUNDS, FLOOR_Z - 8, 0),
    ...k.boxCorners(CAMERA_BOUNDS, 0, ROOM_TOP),
  ],
  VIEW_WIDTH,
  VIEW_HEIGHT,
  { pad: 18, azimuth: 80, elevation: 11 }
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);

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
      d.length
        ? `<path class="iso-shade" data-shade="${shade}" d="${d.join("")}"/>`
        : ""
    ),
    `<g transform="${planeOfY(yFace - depth)}"><path class="${backClass}" d="${shape}"/>${backContent}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    insideContent,
    `</g>`,
    `<g transform="${planeOfY(yFace)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join("");
}

/**
 * 1. Cool-Toned Bedroom Wall, Tiled Floor, Scenic Window & Right Wooden Door
 */
function buildRoomAndWindow() {
  const out = [];
  const WALL_Y = -92;

  // Full-Bleed Tiled Bedroom Floor Slab (extends far past viewport edges for any aspect ratio)
  const FLOOR = { x: -900, y: -98, w: 1800, d: 780, r: 2 };
  out.push(
    S(k.slabOf(FLOOR, FLOOR_Z - 4, 4, P, 4, 0.8), {
      tone: "lo",
      className: "room-floor-slab",
    })
  );

  // White Ceramic Floor Tile Grid Lines across the entire bedroom floor
  const tileLines = [];
  for (let tx = -840; tx <= 840; tx += 38) {
    tileLines.push(k.lineOnTop([tx, -92], [tx, 640], FLOOR_Z, P));
  }
  for (let ty = -60; ty <= 620; ty += 34) {
    tileLines.push(k.lineOnTop([-860, ty], [860, ty], FLOOR_Z, P));
  }
  out.push(L(tileLines.join(""), { tone: "faint", free: true }));

  // Full-Bleed Cool-Toned Bedroom Back Wall (fills the entire background behind the furniture)
  const BACK_WALL = { x: -900, y: -100, w: 1800, d: 8, r: 2 };
  out.push(
    S(k.slabOf(BACK_WALL, FLOOR_Z, 540 - FLOOR_Z, P, 4, 1.0), {
      tone: "mid",
      className: "room-wall-cool",
    })
  );

  // Integrated Bedroom Casement Window Coordinates (starts right above the desk hutch at z=66)
  const WIN_X = -42;
  const WIN_W = 186;
  const WIN_Z0 = 66;
  const WIN_H = 96;

  // Subtle vertical cool wallpaper texture lines on back wall (stopped cleanly around the window)
  const wpLines = [];
  for (let wx = -820; wx <= 820; wx += 26) {
    if (wx >= WIN_X - 14 && wx <= WIN_X + WIN_W + 14) {
      wpLines.push(`M${wx} ${-FLOOR_Z}V${-(WIN_Z0 - 4)}`);
      wpLines.push(`M${wx} ${-(WIN_Z0 + WIN_H + 8)}V-480`);
    } else {
      wpLines.push(`M${wx} ${-FLOOR_Z}V-480`);
    }
  }
  out.push(
    `<g transform="${planeOfY(WALL_Y)}">${L(wpLines.join(""), {
      tone: "faint",
      free: true,
    })}</g>`
  );

  // Baseboard trim along the back wall floor
  const BASEBOARD = { x: -860, y: -92, w: 1720, d: 2.2, r: 0.6 };
  out.push(
    S(k.slabOf(BASEBOARD, FLOOR_Z, 8, P, 2), {
      tone: "lo",
      className: "room-floor-slab",
    })
  );

  // Integrated Warm Teak Wood Bedroom Window Casing Frame (matching the room's wooden carpentry)
  const WIN_FRAME = { x: WIN_X, y: WALL_Y - 1.5, w: WIN_W, d: 5.5, r: 2.5 };
  const WIN_FRONT_Y = WIN_FRAME.y + WIN_FRAME.d;

  out.push(
    `<path class="iso-halo" d="${k.haloOf(WIN_FRAME, WIN_Z0 - 3, WIN_H + 6, P)}"/>`
  );
  out.push(
    S(k.slabOf(WIN_FRAME, WIN_Z0, WIN_H, P, 4, 0.8), {
      tone: "hi",
      className: "wood-cabinet-solid",
    })
  );

  const WIN_WELL = {
    x0: WIN_FRAME.x + 6,
    x1: WIN_FRAME.x + WIN_FRAME.w - 6,
    z0: WIN_Z0 + 6,
    z1: WIN_Z0 + WIN_H - 6,
    r: 2,
    depth: 4.5,
  };

  // Scenic Cool-Breezy Twilight Sky, Crescent Moon, Stars, Clouds & Mountain Silhouette inside Window
  const x0 = WIN_WELL.x0;
  const x1 = WIN_WELL.x1;
  const z0 = WIN_WELL.z0;
  const z1 = WIN_WELL.z1;
  const midX = (x0 + x1) / 2;

  const horizonGlow = `<rect class="window-horizon-glow" x="${x0}" y="${-(z0 + 48)}" width="${x1 - x0}" height="48"/>`;
  const farMountain = `M${x0} ${-z0} L${x0} ${-(z0 + 34)} L${x0 + 42} ${-(z0 + 58)} L${x0 + 88} ${-(z0 + 38)} L${x0 + 134} ${-(z0 + 62)} L${x1} ${-(z0 + 40)} L${x1} ${-z0} Z`;
  const nearMountain = `M${x0} ${-z0} L${x0} ${-(z0 + 20)} L${x0 + 52} ${-(z0 + 36)} L${x0 + 104} ${-(z0 + 22)} L${x0 + 144} ${-(z0 + 34)} L${x1} ${-(z0 + 18)} L${x1} ${-z0} Z`;
  const cloudPath = `M${x0 + 22} ${-(z1 - 24)} H${x0 + 64} M${x0 + 96} ${-(z1 - 34)} H${x0 + 144}`;
  const glassGlintPath = `M${x0 + 18} ${-(z0 + 14)} L${x0 + 44} ${-(z1 - 14)} M${x0 + 28} ${-(z0 + 14)} L${x0 + 50} ${-(z1 - 22)} M${midX + 20} ${-(z0 + 16)} L${midX + 44} ${-(z1 - 16)}`;

  const starsMarkup = [
    [x0 + 24, -(z1 - 13), 1.15],
    [x0 + 52, -(z1 - 18), 0.9],
    [x0 + 76, -(z1 - 10), 1.1],
    [x0 + 112, -(z1 - 16), 0.95],
    [x0 + 148, -(z1 - 12), 1.15],
    [x0 + 92, -(z1 - 28), 0.85],
  ]
    .map(
      ([sx, sy, sr]) =>
        `<circle class="window-star" cx="${sx}" cy="${sy}" r="${sr}"/>`
    )
    .join("");

  const moonMarkup = `<circle class="window-moon-glow" cx="${x1 - 30}" cy="${-(z1 - 22)}" r="11"/><circle class="window-moon" cx="${x1 - 30}" cy="${-(z1 - 22)}" r="6"/><circle class="desk-window-sky" cx="${x1 - 27.4}" cy="${-(z1 - 23.8)}" r="5"/>`;

  const cityLights = [
    x0 + 28,
    x0 + 36,
    x0 + 45,
    x0 + 86,
    x0 + 95,
    x0 + 122,
    x0 + 132,
  ]
    .map(
      (lx, idx) =>
        `<rect class="window-city-light" x="${lx}" y="${-(z0 + 6 + (idx % 3) * 3)}" width="2.8" height="1.8" rx="0.4"/>`
    )
    .join("");

  const windowScene = [
    horizonGlow,
    starsMarkup,
    moonMarkup,
    `<path class="window-cloud" d="${cloudPath}"/>`,
    `<path class="window-mountain-far" d="${farMountain}"/>`,
    `<path class="window-mountain-near" d="${nearMountain}"/>`,
    cityLights,
    `<path class="window-glass-glint" d="${glassGlintPath}"/>`,
  ].join("");

  out.push(
    recessedWindow(
      WIN_WELL,
      WIN_FRONT_Y,
      windowScene,
      "desk-window-sky"
    )
  );

  // 3D Wooden Casement Center Mullion Post & Top Transom Bar inside the Window
  const MULLION_V = { x: midX - 2.0, y: WALL_Y - 0.5, w: 4.0, d: 4.2, r: 0.6 };
  const MULLION_H = {
    x: WIN_WELL.x0,
    y: WALL_Y - 0.5,
    w: WIN_WELL.x1 - WIN_WELL.x0,
    d: 3.8,
    r: 0.6,
  };
  out.push(
    S(k.slabOf(MULLION_V, WIN_WELL.z0, WIN_WELL.z1 - WIN_WELL.z0, P, 2, 0.3), {
      tone: "mid",
      className: "wood-door-solid",
    }),
    S(k.slabOf(MULLION_H, WIN_Z0 + 60, 3.4, P, 2, 0.3), {
      tone: "mid",
      className: "wood-door-solid",
    })
  );

  // Deep Projecting Teak Wooden Window Sill Ledge (connects directly behind the desk hutch top rail!)
  const SILL = { x: WIN_X - 5, y: WALL_Y - 0.5, w: WIN_W + 10, d: 9.0, r: 1.5 };
  out.push(
    S(k.slabOf(SILL, WIN_Z0 - 4, 4.5, P, 3, 0.5), {
      tone: "hi",
      className: "wood-top-slab",
    })
  );

  // Wooden Window Pelmet / Curtain Valance Rod & Soft Draped Side Curtains framing the window
  const CURTAIN_ROD = {
    x: WIN_X - 12,
    y: WALL_Y + 1.5,
    w: WIN_W + 24,
    d: 4.5,
    r: 1.2,
  };
  out.push(
    S(k.slabOf(CURTAIN_ROD, WIN_Z0 + WIN_H + 1, 4.0, P, 3, 0.4), {
      tone: "hi",
      className: "wood-top-slab",
    })
  );

  const CURTAIN_L = { x: WIN_X - 8, y: WALL_Y + 1, w: 24, d: 6.5, r: 2 };
  const CURTAIN_R = {
    x: WIN_X + WIN_W - 16,
    y: WALL_Y + 1,
    w: 24,
    d: 6.5,
    r: 2,
  };
  out.push(
    S(k.slabOf(CURTAIN_L, WIN_Z0 - 4, WIN_H + 5, P, 3, 0.5), {
      tone: "mid",
      className: "window-curtain-solid",
    }),
    S(k.slabOf(CURTAIN_R, WIN_Z0 - 4, WIN_H + 5, P, 3, 0.5), {
      tone: "mid",
      className: "window-curtain-solid",
    })
  );

  // Vertical pleat lines on the left and right bedroom curtains
  const pleatLines = [];
  for (const cx of [
    CURTAIN_L.x + 6,
    CURTAIN_L.x + 12,
    CURTAIN_L.x + 18,
    CURTAIN_R.x + 6,
    CURTAIN_R.x + 12,
    CURTAIN_R.x + 18,
  ]) {
    pleatLines.push(
      k.pathOf(
        [
          at([cx, WALL_Y + 7.5, WIN_Z0 - 2]),
          at([cx, WALL_Y + 7.5, WIN_Z0 + WIN_H - 1]),
        ],
        false
      )
    );
  }
  out.push(L(pleatLines.join(""), { tone: "lo", free: true }));

  return out.join("");
}

/**
 * 2. Left Tall Teak Wooden Cabinet + Open Bookshelf + Hanging Blue Hanger & ID Lanyard
 */
function buildLeftCabinet() {
  const out = [];

  // Main Tall Cabinet Body on the left (x: -204..-84, y: -88..58 — flush depth & connected to Study Desk!)
  const CAB_BASE = { x: -204, y: -88, w: 120, d: 146, r: 2 };
  out.push(
    `<path class="iso-halo" d="${k.haloOf(CAB_BASE, FLOOR_Z, 16, P)}"/>`
  );

  // Lower Cabinet Section (z: FLOOR_Z .. -8) — aligns with the under-desk height!
  out.push(
    S(k.slabOf(CAB_BASE, FLOOR_Z, -8 - FLOOR_Z, P, 4, 0.9), {
      tone: "hi",
      className: "wood-cabinet-solid",
    })
  );

  // Continuous Waist Trim Slab (z: -8 .. 0) connecting directly into the Study Desk Tabletop!
  const CAB_WAIST = { x: -205, y: -88, w: 121, d: 148, r: 2.5 };
  out.push(
    S(k.slabOf(CAB_WAIST, -8, 8, P, 4, 0.9), {
      tone: "hi",
      className: "wood-top-slab",
    })
  );

  // 2 Lower Cabinet Doors on front face (y = 56) with silver handles (tall realistic lower cabinet!)
  const LOW_DOOR_L = { x: -198, y: 56, w: 52, d: 2.5, r: 1 };
  const LOW_DOOR_R = { x: -143, y: 56, w: 52, d: 2.5, r: 1 };
  out.push(
    S(k.slabOf(LOW_DOOR_L, FLOOR_Z + 6, 94, P, 3, 0.4), {
      tone: "mid",
      className: "wood-door-solid",
    }),
    S(k.slabOf(LOW_DOOR_R, FLOOR_Z + 6, 94, P, 3, 0.4), {
      tone: "mid",
      className: "wood-door-solid",
    })
  );
  // Lower door silver handles
  out.push(
    S(
      k.slabOf({ x: -153, y: 58.5, w: 2.2, d: 2, r: 0.5 }, -52, 18, P, 2),
      { tone: "hi", className: "silver-hardware" }
    ),
    S(
      k.slabOf({ x: -138, y: 58.5, w: 2.2, d: 2, r: 0.5 }, -52, 18, P, 2),
      { tone: "hi", className: "silver-hardware" }
    )
  );

  // Upper Cabinet Left Back/Side Shell + Open Bookshelf Cubbies (x: -204..-145, z: 0..126)
  const LEFT_WALL = { x: -204, y: -88, w: 7, d: 146, r: 1.5 };
  const BACK_PANEL = { x: -204, y: -88, w: 62, d: 8, r: 1.5 };
  out.push(
    S(k.slabOf(LEFT_WALL, 0, 126, P, 3, 0.5), {
      tone: "mid",
      className: "wood-cabinet-solid",
    }),
    S(k.slabOf(BACK_PANEL, 0, 126, P, 3, 0.5), {
      tone: "lo",
      className: "wood-dark-solid",
    })
  );

  // Horizontal Shelf Dividers inside the Open Left Bookshelf (z = 42, 84)
  for (const sz of [42, 84]) {
    const SHELF = { x: -198, y: -80, w: 55, d: 136, r: 1.5 };
    out.push(
      S(k.slabOf(SHELF, sz, 4, P, 3, 0.4), {
        tone: "mid",
        className: "wood-door-solid",
      })
    );
  }

  // Bottom Open Cubby Items (z = 0): White stacked paper ream (like the photo!)
  const PAPERS = { x: -192, y: 4, w: 42, d: 46, r: 1.5 };
  out.push(
    S(k.slabOf(PAPERS, 0, 9, P, 3, 0.4), {
      tone: "mid",
      className: "paper-stack-solid",
    })
  );

  // Middle Open Cubby (z = 46): Populated with interactive Career Documents Hotspot [06] (see buildDocumentsInLeftShelf)
  return out.join("");
}

/**
 * 2B. Upper Right Wardrobe Compartment, Hanger/Lanyard & Top Crown Roof
 * (Rendered after the open bookshelf books so the wardrobe divider & roof frame the books cleanly)
 */
function buildCabinetFrontAndCrown() {
  const out = [];

  // Upper Cabinet Right Tall Wardrobe Compartment (x: -145..-84, y: -88..58, z: 0..126)
  const RIGHT_WARDROBE = { x: -145, y: -88, w: 61, d: 146, r: 2 };
  out.push(
    S(k.slabOf(RIGHT_WARDROBE, 0, 126, P, 4, 0.8), {
      tone: "hi",
      className: "wood-cabinet-solid",
    })
  );

  // Tall Wardrobe Front Door (y = 56)
  const TALL_DOOR = { x: -142, y: 56, w: 54, d: 2.8, r: 1.2 };
  out.push(
    S(k.slabOf(TALL_DOOR, 4, 118, P, 3, 0.5), {
      tone: "mid",
      className: "wood-door-solid",
    })
  );

  // Cabinet Top Crown Roof Slab (z = 126..132) — caps the open bookshelf and supports Trophy & Certificates!
  const CAB_CROWN = { x: -206, y: -90, w: 123, d: 150, r: 3 };
  out.push(
    S(k.slabOf(CAB_CROWN, 126, 6, P, 4, 0.9), {
      tone: "hi",
      className: "wood-top-slab",
    })
  );

  return out.join("");
}

/**
 * 3. Wooden Study Desk with Raised Hutch Backboard, Side Wing & Right 2-Drawer Pedestal
 */
function buildStudyDesk() {
  const out = [];

  // Under-Desk Left Side Support Panel (flush with the Left Cabinet at x=-88..-81, y=-88..58) & Top Apron Beam
  const DESK_LEFT_LEG = { x: -88, y: -88, w: 7, d: 146, r: 1.5 };
  const DESK_BACK_MODESTY = { x: -88, y: -88, w: 162, d: 6, r: 1.5 };
  out.push(
    S(k.slabOf(DESK_LEFT_LEG, FLOOR_Z, -8 - FLOOR_Z, P, 3, 0.5), {
      tone: "mid",
      className: "wood-cabinet-solid",
    }),
    S(k.slabOf(DESK_BACK_MODESTY, -20, 12, P, 3, 0.5), {
      tone: "lo",
      className: "wood-dark-solid",
    })
  );

  // Under-Desk Right 2-Drawer Wooden Pedestal (x: 68..166, y: -84..58, z: FLOOR_Z..-8 — tall 104-unit height!)
  const PEDESTAL = { x: 68, y: -84, w: 98, d: 142, r: 2.5 };
  out.push(
    `<path class="iso-halo" d="${k.haloOf(PEDESTAL, FLOOR_Z, 10, P)}"/>`
  );
  out.push(
    S(k.slabOf(PEDESTAL, FLOOR_Z, -8 - FLOOR_Z, P, 4, 0.8), {
      tone: "mid",
      className: "wood-cabinet-solid",
    })
  );

  // 2 Stacked Wooden Drawer Fronts (y = 56.5) with twin silver knobs (tall realistic drawers!)
  const DRAWER_TOP = { x: 73, y: 56.5, w: 88, d: 2.8, r: 1.2 };
  const DRAWER_BOT = { x: 73, y: 56.5, w: 88, d: 2.8, r: 1.2 };
  out.push(
    S(k.slabOf(DRAWER_TOP, -55, 43, P, 3, 0.4), {
      tone: "hi",
      className: "wood-door-solid",
    }),
    S(k.slabOf(DRAWER_BOT, -104, 43, P, 3, 0.4), {
      tone: "hi",
      className: "wood-door-solid",
    })
  );
  // Drawer silver hardware knobs (matching real photo)
  for (const [kx, kz] of [
    [101, -34],
    [131, -34],
    [101, -83],
    [131, -83],
  ]) {
    out.push(
      S(
        k.slabOf({ x: kx - 1.6, y: 59, w: 3.2, d: 2.2, r: 0.8 }, kz, 3.2, P, 2),
        { tone: "hi", className: "silver-hardware" }
      )
    );
  }

  // Main Wooden Study Desk Tabletop Slab (x: -88..168, y: -88..60, z: -8..0 — connects seamlessly with CAB_WAIST!)
  const TABLETOP = { x: -88, y: -88, w: 256, d: 148, r: 2.5 };
  out.push(
    S(k.slabOf(TABLETOP, -8, 8, P, 5, 1.1), {
      tone: "hi",
      className: "wood-top-slab",
    })
  );

  // Raised Wooden Hutch Backboard behind the Desk (x: -86..168, y: -88..-78, z: 0..64)
  const HUTCH_POST_L = { x: -86, y: -88, w: 7, d: 14, r: 1 };
  const HUTCH_BOARD = { x: -86, y: -88, w: 254, d: 6.5, r: 1.5 };
  const HUTCH_TOP_RAIL = { x: -86, y: -88, w: 254, d: 10, r: 2 };
  out.push(
    S(k.slabOf(HUTCH_POST_L, 0, 64, P, 3, 0.4), {
      tone: "mid",
      className: "wood-cabinet-solid",
    }),
    S(k.slabOf(HUTCH_BOARD, 36, 24, P, 3, 0.5), {
      tone: "mid",
      className: "wood-door-solid",
    }),
    S(k.slabOf(HUTCH_TOP_RAIL, 60, 4, P, 3, 0.6), {
      tone: "hi",
      className: "wood-top-slab",
    })
  );

  // Small Red/White Emblem Sticker in the center of the Hutch Board (exact photo detail!)
  const STICKER = { x: 32, y: -81, w: 12, d: 1.2, r: 0.5 };
  out.push(
    S(k.slabOf(STICKER, 46, 5, P, 2, 0.2), {
      tone: "hi",
      lit: true,
    })
  );

  return out.join("");
}

/**
 * 4. [02] Hanging Name Tag / ID Card & Lanyard on Wardrobe Door ("About Me" Hotspot)
 * (Matches the real bedroom photo where the ID badge & blue hanger hang on the left cabinet door handle!)
 */
function buildWallPhoto(photoHref) {
  const out = [];
  const H_X = -124;
  const H_Y = 59.5;
  const H_Z = 66;

  // Silver Handle on Tall Wardrobe Door
  out.push(
    S(
      k.slabOf(
        { x: H_X - 1.4, y: H_Y - 1, w: 2.8, d: 2.6, r: 0.6 },
        H_Z,
        14,
        P,
        2
      ),
      { tone: "hi", className: "silver-hardware" }
    )
  );

  // Blue Coat Hanger Triangle hanging from the wardrobe handle
  const hangerPts = [
    at([H_X, H_Y + 1.2, H_Z + 6]),
    at([H_X - 22, H_Y + 2.2, H_Z - 12]),
    at([H_X + 22, H_Y + 2.2, H_Z - 12]),
  ];
  out.push(
    `<path class="hanger-blue-wire" d="${k.pathOf(hangerPts, true)}"/>`
  );

  // Lanyard Ribbon Strap looping from the handle down to the ID Name Tag
  const lanyardPath = k.pathOf(
    [
      at([H_X - 2.2, H_Y + 1.8, H_Z + 5]),
      at([H_X - 3.6, H_Y + 2.2, H_Z - 21]),
      at([H_X + 3.6, H_Y + 2.2, H_Z - 21]),
      at([H_X + 2.2, H_Y + 1.8, H_Z + 5]),
    ],
    false
  );
  out.push(`<path class="lanyard-strap" d="${lanyardPath}"/>`);

  // Silver Lanyard Clasp Clip above the Name Tag
  out.push(
    S(
      k.slabOf(
        { x: H_X - 2.5, y: H_Y + 1.4, w: 5, d: 2.0, r: 0.5 },
        H_Z - 23.5,
        3.5,
        P,
        2
      ),
      { tone: "hi", className: "silver-hardware" }
    )
  );

  // Hanging ID Card / Name Tag Holder (x: -136..-112, y: 60.3..62.7, z: 10..43)
  const BADGE = { x: H_X - 12, y: H_Y + 0.8, w: 24, d: 2.4, r: 1.5 };
  const BZ0 = 10;
  const BH = 33;
  const B_FRONT_Y = BADGE.y + BADGE.d;

  out.push(
    S(k.slabOf(BADGE, BZ0, BH, P, 3, 0.4), {
      tone: "hi",
      className: "hotspot-primary paper-stack-solid",
    })
  );

  // Blue ID Card Top Header Strip inside the Name Tag
  const BADGE_HEADER = {
    x: BADGE.x + 2,
    y: BADGE.y + 0.5,
    w: BADGE.w - 4,
    d: 2.1,
    r: 0.6,
  };
  out.push(
    S(k.slabOf(BADGE_HEADER, BZ0 + BH - 5.5, 3.5, P, 2, 0.2), {
      tone: "mid",
      className: "coaster-blue-solid",
    })
  );

  // Recessed Portrait Photo inside the Hanging Name Tag
  const PHOTO_WELL = {
    x0: BADGE.x + 2.8,
    x1: BADGE.x + BADGE.w - 2.8,
    z0: BZ0 + 7.5,
    z1: BZ0 + BH - 6.5,
    r: 1.0,
    depth: 1.0,
  };
  const imgW = PHOTO_WELL.x1 - PHOTO_WELL.x0;
  const imgH = PHOTO_WELL.z1 - PHOTO_WELL.z0;

  const imageMarkup = photoHref
    ? `<image href="${photoHref}" x="${PHOTO_WELL.x0}" y="${-PHOTO_WELL.z1}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid slice" class="desk-wall-photo"/>`
    : "";

  out.push(
    recessedWindow(PHOTO_WELL, B_FRONT_Y, imageMarkup, "desk-photo-well")
  );

  // Micro ID label at the bottom of the hanging Name Tag
  out.push(
    `<g transform="${planeOfY(B_FRONT_Y)}"><text class="iso-face-text" data-tone="hi" x="${BADGE.x + 3.2}" y="${-(BZ0 + 3.2)}" font-size="2.5">ABOUT ME</text></g>`
  );

  return out.join("");
}

/**
 * 5. [05] Glowing Trophy & 7 Certificates on Top-Left Cabinet ("Credentials" Hotspot)
 */
function buildTrophyOnCabinet() {
  const out = [];
  const TOP_Z = 132; // Sits directly on top of the tall left cabinet!

  // 7 Certificate Folios / Bound Volumes standing on the left of the cabinet top
  const certSlabs = [];
  const awardSlabs = [];
  const certHeights = [26, 28, 25, 29, 27, 30, 28];
  certHeights.forEach((ch, idx) => {
    const cx = -194 + idx * 5.8;
    const folio = { x: cx, y: -58, w: 5.0, d: 24, r: 1 };
    const slab = k.slabOf(folio, TOP_Z, ch, P, 3, 0.3);
    if (idx === 4 || idx === 5) {
      awardSlabs.push(slab);
    } else {
      certSlabs.push(slab);
    }
  });

  if (certSlabs.length) {
    out.push(
      S(mergeSlabs(certSlabs), {
        tone: "mid",
        className: "paper-stack-solid",
      })
    );
  }
  if (awardSlabs.length) {
    out.push(
      S(mergeSlabs(awardSlabs), {
        tone: "hi",
        lit: true,
        className: "hotspot-primary",
      })
    );
  }

  // Championship Trophy on the right side of the top-left cabinet (x = -134, y = -42)
  const TX = -134;
  const TY = -42;
  const plinth = { x: TX - 12, y: TY - 12, w: 24, d: 24, r: 3 };
  out.push(
    `<path class="iso-halo trophy-aura-halo" d="${k.haloOf(plinth, TOP_Z, 12, P)}"/>`
  );
  out.push(
    S(k.slabOf(plinth, TOP_Z, 7.5, P, 4, 0.6), {
      tone: "lo",
      className: "dark-hardware-solid",
    })
  );

  // Brass plate on front of trophy plinth
  out.push(
    S(
      k.slabOf(
        { x: TX - 7.5, y: TY + 11.2, w: 15, d: 1.2, r: 0.4 },
        TOP_Z + 1.8,
        4,
        P,
        2
      ),
      { tone: "hi", lit: true }
    )
  );

  // Turned Golden Trophy Cup via lathe.js
  const trophyFrame = G.frameOf(
    [TX, TY, TOP_Z + 7.5],
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0]
  );
  const trophyProfile = [
    [0, 7.8],
    [2.5, 7.8],
    [4.2, 3.2, 1],
    [12, 2.5, 1],
    [16, 4.5, 1],
    [19, 9.2, 1],
    [32, 11.8, 1],
    [35, 12.4],
  ];
  const cupPaths = G.solidOf(trophyProfile, trophyFrame, P, { bevel: 0.5 });
  const cupSeam = G.arcOf(trophyFrame, 16, 4.5, P);
  out.push(
    S(cupPaths, {
      tone: "hi",
      lit: true,
      className: "hotspot-primary trophy-cup-solid",
      inner: L(cupSeam, { tone: "lo" }),
    })
  );
  out.push(L(k.ring(TX, TY, 9.6, TOP_Z + 42.5, P, 26), { tone: "lo" }));

  return out.join("");
}

/**
 * 6. [04] Clickable Books in the Left Cabinet Open Shelf ("What I Do" Hotspot)
 */
function buildBooksInLeftShelf() {
  const out = [];
  const SHELF_TOP = 88; // Upper open cubby of the left wooden cabinet (x: -197..-146, z: 88..122)

  // Neat upright row of books standing inside the open shelf cubby
  const regularBooks = [];
  const featuredBooks = [];
  const bookSpecs = [
    { x: -195, w: 6.2, h: 27, featured: false },
    { x: -188, w: 6.2, h: 29, featured: false },
    { x: -181, w: 6.5, h: 28, featured: false },
    { x: -173.5, w: 7.5, h: 31, featured: true }, // Featured golden "What I Do" Book slightly pulled forward!
    { x: -165, w: 6.2, h: 28, featured: false },
    { x: -158, w: 6.2, h: 26, featured: false },
  ];

  bookSpecs.forEach((b) => {
    const pullY = b.featured ? 5 : 0;
    const plan = {
      x: b.x,
      y: 26 + pullY,
      w: b.w,
      d: 20,
      r: 1.0,
    };
    const slab = k.slabOf(plan, SHELF_TOP, b.h, P, 3, 0.35);
    if (b.featured) {
      featuredBooks.push(slab);
    } else {
      regularBooks.push(slab);
    }
  });

  if (regularBooks.length) {
    out.push(
      S(mergeSlabs(regularBooks), {
        tone: "mid",
        className: "book-shelf-regular",
      })
    );
  }
  if (featuredBooks.length) {
    out.push(
      S(mergeSlabs(featuredBooks), {
        tone: "hi",
        lit: true,
        className: "hotspot-primary book-shelf-featured",
      })
    );
  }

  return out.join("");
}

/**
 * 6B. [06] Clickable Career Documents & Dossier in the Left Cabinet Middle Shelf ("Documents" Hotspot)
 * Features 3 standing archival binders (CV, Portfolio, Resume) and a horizontal dossier case.
 */
function buildDocumentsInLeftShelf() {
  const out = [];
  const SHELF_MID = 46; // Middle open cubby floor of the left wooden cabinet (x: -198..-145, z: 46..84)

  // 1. Standing Archival Binders for CV, Portfolio, and Resume
  const cvBinder = k.slabOf(
    { x: -195, y: 14, w: 7.5, d: 34, r: 1.0 },
    SHELF_MID,
    31,
    P,
    3,
    0.35
  );
  const portfolioBinder = k.slabOf(
    { x: -186, y: 18, w: 9.5, d: 36, r: 1.0 },
    SHELF_MID,
    34,
    P,
    3,
    0.35
  );
  const resumeBinder = k.slabOf(
    { x: -175, y: 15, w: 7.0, d: 33, r: 1.0 },
    SHELF_MID,
    29,
    P,
    3,
    0.35
  );

  // 2. Horizontal Document Dossier Portfolio Folder lying flat next to the binders
  const dossierFolder = k.slabOf(
    { x: -166, y: 14, w: 20, d: 34, r: 1.2 },
    SHELF_MID,
    7.5,
    P,
    3,
    0.35
  );
  // Gold Seal / Emblem on top of dossier
  const dossierBadge = k.slabOf(
    { x: -159, y: 28, w: 6.5, d: 6.5, r: 3.2 },
    SHELF_MID + 7.5,
    1.2,
    P,
    2,
    0.2
  );

  // Spine Label accents on binders
  const cvLabel = k.slabOf(
    { x: -194, y: 44, w: 5.5, d: 3.5, r: 0.5 },
    SHELF_MID + 10,
    12,
    P,
    2,
    0.2
  );
  const portLabel = k.slabOf(
    { x: -184.5, y: 50, w: 6.5, d: 3.5, r: 0.5 },
    SHELF_MID + 10,
    14,
    P,
    2,
    0.2
  );
  const resLabel = k.slabOf(
    { x: -174, y: 44, w: 5.0, d: 3.5, r: 0.5 },
    SHELF_MID + 9,
    11,
    P,
    2,
    0.2
  );

  out.push(
    S(cvBinder, {
      tone: "mid",
      className: "doc-binder-cv",
    }),
    S(cvLabel, {
      tone: "hi",
      className: "doc-label-white",
    }),
    S(portfolioBinder, {
      tone: "hi",
      lit: true,
      className: "hotspot-primary doc-binder-portfolio",
    }),
    S(portLabel, {
      tone: "hi",
      className: "doc-label-white",
    }),
    S(resumeBinder, {
      tone: "mid",
      className: "doc-binder-resume",
    }),
    S(resLabel, {
      tone: "hi",
      className: "doc-label-white",
    }),
    S(dossierFolder, {
      tone: "mid",
      className: "doc-dossier-solid",
    }),
    S(dossierBadge, {
      tone: "hi",
      lit: true,
      className: "hotspot-primary doc-seal-gold",
    })
  );

  return out.join("");
}

/**
 * 7. [01] External Widescreen Monitor & Red-Backlit Gaming Laptop ("Projects" Hotspot)
 */
function buildMonitorAndLaptop() {
  const out = [];

  // --- A. Center-Left External Widescreen Monitor (x: -44..48, y: -58..-42) ---
  const STAND_BASE = { x: -16, y: -56, w: 36, d: 24, r: 2.5 };
  const STAND_NECK = { x: -4, y: -54, w: 12, d: 7, r: 1.2 };
  out.push(
    `<path class="iso-halo" d="${k.haloOf(STAND_BASE, 0, 6, P)}"/>`,
    S(k.slabOf(STAND_BASE, 0, 2.5, P, 3, 0.4), {
      tone: "lo",
      className: "dark-hardware-solid",
    }),
    S(k.slabOf(STAND_NECK, 2.5, 14, P, 3, 0.3), {
      tone: "lo",
      className: "dark-hardware-solid",
    })
  );

  // Widescreen Flat Monitor Bezel Housing
  const MON = { x: -46, y: -52, w: 96, d: 11, r: 3.5 };
  const MON_Z0 = 14;
  const MON_H = 56;
  const MON_TOP = MON_Z0 + MON_H; // 70
  const MON_FRONT = MON.y + MON.d; // -41

  out.push(
    S(k.slabOf(MON, MON_Z0, MON_H, P, 5, 0.9), {
      tone: "hi",
      className: "hotspot-primary dark-hardware-solid",
    })
  );

  // Recessed Widescreen Display with Dashboard & Project Cards Preview
  const SCREEN = {
    x0: MON.x + 4,
    x1: MON.x + MON.w - 4,
    z0: MON_Z0 + 5,
    z1: MON_TOP - 4,
    r: 2,
    depth: 2.2,
  };

  const screenGlow = flatRect(
    SCREEN.x0 + 3,
    SCREEN.z0 + 3,
    SCREEN.x1 - 3,
    SCREEN.z1 - 3,
    4,
    5
  );
  const card1 = flatRect(-38, 36, -15, 52, 1.5, 4);
  const card2 = flatRect(-11, 36, 12, 52, 1.5, 4);
  const card3 = flatRect(16, 36, 39, 52, 1.5, 4);
  const wavePath = `M-36 -28 L-24 -32 L-12 -29 L2 -34 L16 -30 L30 -35 L40 -32`;

  const screenContent = [
    `<path class="desk-screen-glow" d="${screenGlow}"/>`,
    `<path class="desk-screen-card" d="${card1}${card2}${card3}"/>`,
    `<path class="iso-line" data-tone="lit" d="${wavePath}"/>`,
    `<text class="desk-screen-title" x="-38" y="-58" font-size="4.2">BAGAS_OS // 11 PROJECTS</text>`,
    `<text class="desk-screen-sub" x="-38" y="-22" font-size="3.8">&gt; CLICK MONITOR TO ENTER</text>`,
    `<rect class="desk-screen-cursor" x="28" y="-25.5" width="2.6" height="3.8"/>`,
  ].join("");

  out.push(
    recessedWindow(SCREEN, MON_FRONT, screenContent, "desk-screen-glass")
  );

  // Monitor Power LED
  out.push(
    D([at([42, MON_FRONT, MON_Z0 + 2.5])], {
      size: 0.85,
      tone: "hi",
      pulse: true,
    })
  );

  // --- B. Right-Side Gaming Laptop with Red Backlit Keyboard (x: 62..136, y: -26..22) ---
  const LAP_BASE = { x: 62, y: -26, w: 74, d: 48, r: 3.5 };
  out.push(
    `<path class="iso-halo" d="${k.haloOf(LAP_BASE, 0, 5, P)}"/>`,
    S(k.slabOf(LAP_BASE, 0, 3.8, P, 4, 0.6), {
      tone: "hi",
      className: "dark-hardware-solid",
    })
  );

  // Red Backlit Gaming Keyboard Well on the Laptop Base (exact photo signature!)
  const RED_KB = { x: 67, y: -18, w: 64, d: 22, r: 1.8 };
  out.push(
    S(k.slabOf(RED_KB, 3.8, 1.1, P, 3, 0.2), {
      tone: "hi",
      lit: true,
      className: "laptop-red-keyboard",
    })
  );
  // Key grid lines across the red backlit laptop keyboard
  const lapKeyLines = [];
  for (let ry = -13; ry <= 2; ry += 5) {
    lapKeyLines.push(k.lineOnTop([69, ry], [129, ry], 5.0, P));
  }
  for (let rx = 74; rx <= 124; rx += 7) {
    lapKeyLines.push(k.lineOnTop([rx, -17], [rx, 3], 5.0, P));
  }
  out.push(L(lapKeyLines.join(""), { tone: "hi", free: true }));

  // Laptop Trackpad & GPU Wrist Sticker
  out.push(
    L(
      k.planOutline({ x: 88, y: 6, w: 19, d: 11, r: 1.2 }, 3.8, P, 3),
      { tone: "mid" }
    )
  );
  out.push(
    D([at([69, 11, 3.9]), at([74, 11, 3.9])], {
      size: 0.9,
      tone: "hi",
    })
  );

  // Open Gaming Laptop Screen Housing hinged cleanly at the back of the laptop base
  const LAP_SCR = { x: 63, y: -30, w: 72, d: 5.5, r: 2.5 };
  const LAP_Z0 = 3.8;
  const LAP_H = 44;
  const LAP_FRONT = LAP_SCR.y + LAP_SCR.d; // -24.5
  out.push(
    S(k.slabOf(LAP_SCR, LAP_Z0, LAP_H, P, 4, 0.6), {
      tone: "hi",
      className: "hotspot-primary dark-hardware-solid",
    })
  );

  const LAP_WELL = {
    x0: LAP_SCR.x + 3.5,
    x1: LAP_SCR.x + LAP_SCR.w - 3.5,
    z0: LAP_Z0 + 3.5,
    z1: LAP_Z0 + LAP_H - 3.5,
    r: 1.5,
    depth: 1.5,
  };
  const ideLines = [
    `M70 -39 H102`,
    `M74 -34 H122`,
    `M74 -29 H114`,
    `M70 -24 H126`,
    `M74 -19 H108`,
    `M70 -14 H96`,
  ].join("");
  out.push(
    recessedWindow(
      LAP_WELL,
      LAP_FRONT,
      `<path class="iso-line" data-tone="lit" d="${ideLines}"/>`,
      "desk-screen-glass"
    )
  );

  return out.join("");
}

/**
 * 8. Mechanical Keyboard, Mouse & Dark Mousepad in Front of Monitor
 */
const KB_ROWS = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2],
  [2.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.8],
  [1.5, 1.5, 1.5, 6.5, 1.5, 1.5],
];
const KB_ROW_H = [3.2, 3.0, 2.8, 2.6, 2.5];

function buildKeyboardAndMouse() {
  const out = [];

  // Dark Extended Mousepad under Mouse & Keyboard right edge (x: -10..42, separated cleanly from Laptop at x=62!)
  const PAD = { x: -10, y: -10, w: 52, d: 40, r: 3 };
  out.push(
    S(k.slabOf(PAD, 0, 1.2, P, 4, 0.2), {
      tone: "lo",
      className: "dark-hardware-solid",
    })
  );

  // Mechanical Keyboard Chassis (x: -48..20, y: -10..24)
  const KB = { x: -48, y: -10, w: 68, d: 34, r: 2.5 };
  const KB_Z = 1.2;
  const KB_TOP = 4.6;
  const U = 4.55;
  const KEYS_X = KB.x + 3.0;
  const KEYS_Y = KB.y + 3.5;

  out.push(
    `<path class="iso-halo" d="${k.haloOf(KB, 0, 3, P)}"/>`,
    S(k.slabOf(KB, KB_Z, KB_TOP - KB_Z, P, 4, 0.6), {
      tone: "hi",
      className: "dark-hardware-solid",
    })
  );

  const regularCaps = [];
  const litCaps = [];
  KB_ROWS.forEach((row, rIdx) => {
    let x = KEYS_X;
    row.forEach((widthUnits, cIdx) => {
      const plan = {
        x: x + 0.35,
        y: KEYS_Y + rIdx * U + 0.35,
        w: widthUnits * U - 0.7,
        d: U - 0.85,
        r: 0.7,
      };
      const kh = KB_ROW_H[rIdx];
      const slab = k.slabOf(plan, KB_TOP, kh, P, 3, 0.25);
      if (rIdx === 0 && cIdx === 0) {
        litCaps.push(slab);
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
        className: "dark-hardware-solid",
      })
    );
  }
  if (litCaps.length) {
    out.push(S(mergeSlabs(litCaps), { tone: "hi", lit: true, crease: "faint" }));
  }

  // Ergonomic Gaming Mouse on the Dark Mousepad (x: 24..37, y: 2..21)
  const MOUSE = { x: 24, y: 2, w: 13, d: 19, r: 4.5 };
  out.push(
    S(k.slabOf(MOUSE, 1.2, 4.8, P, 5, 0.6), {
      tone: "hi",
      className: "dark-hardware-solid",
    })
  );
  // Scroll wheel
  out.push(
    S(
      k.slabOf({ x: 29.7, y: 4, w: 1.6, d: 4, r: 0.6 }, 6.0, 1.0, P, 2),
      { tone: "hi", lit: true }
    )
  );

  // Mouse Cord connecting back toward Monitor/Desk
  const mouseRoute = G.fillet(
    [
      [30.5, 2, 2.2],
      [30.5, -14, 1.8],
      [22, -34, 2.0],
    ],
    4,
    5,
    { P, tube: 0.7 }
  );
  for (const piece of tubePieces(mouseRoute, 0.7, P, { maxLength: 40 })) {
    out.push(tubeSvg(piece, { tone: "lo" }));
  }

  // Right Side Partition Wall with Cutout Window (rendered in foreground on right edge of desk)
  const SIDE_BACK = { x: 161, y: -86, w: 7, d: 34, r: 1.5 };
  const SIDE_FRONT = { x: 161, y: 24, w: 7, d: 40, r: 1.5 };
  const SIDE_TOP = { x: 161, y: -86, w: 7, d: 150, r: 2 };
  out.push(
    S(k.slabOf(SIDE_BACK, 0, 52, P, 3, 0.4), {
      tone: "mid",
      className: "wood-cabinet-solid",
    }),
    S(k.slabOf(SIDE_FRONT, 0, 52, P, 3, 0.4), {
      tone: "mid",
      className: "wood-cabinet-solid",
    }),
    S(k.slabOf(SIDE_TOP, 52, 10, P, 3, 0.5), {
      tone: "hi",
      className: "wood-top-slab",
    })
  );

  return `<g class="desk-input-gear" data-part="keyboard-mouse">${out.join("")}</g>`;
}

/**
 * 9. [03] Smartphone on Angled Desk Stand ("Contact Me" Hotspot) — Left of Monitor
 */
function buildSmartphoneOnStand() {
  const out = [];
  const SX = -68;
  const SY = 6;

  // Anodized Aluminum Smartphone Stand Base & Upright Cradle
  const STAND_FOOT = { x: SX - 2, y: SY - 2, w: 22, d: 24, r: 2.5 };
  const STAND_PILLAR = { x: SX + 4, y: SY + 2, w: 10, d: 6, r: 1.2 };
  out.push(
    `<path class="iso-halo" d="${k.haloOf(STAND_FOOT, 0, 5, P)}"/>`,
    S(k.slabOf(STAND_FOOT, 0, 2.2, P, 3, 0.4), {
      tone: "mid",
      className: "silver-hardware",
    }),
    S(k.slabOf(STAND_PILLAR, 2.2, 12, P, 3, 0.3), {
      tone: "mid",
      className: "silver-hardware",
    })
  );

  // Smartphone Body resting vertically on the Stand (x: SX..SX+18, y: SY+6..SY+12, z: 4..32)
  const PHONE_BODY = { x: SX, y: SY + 6, w: 18, d: 4.5, r: 2.2 };
  const PZ0 = 4;
  const PH = 28;
  const P_FRONT = PHONE_BODY.y + PHONE_BODY.d;

  out.push(
    S(k.slabOf(PHONE_BODY, PZ0, PH, P, 4, 0.6), {
      tone: "hi",
      lit: true,
      className: "hotspot-primary phone-stand-body",
    })
  );

  // Glowing Smartphone Screen on the front face
  const PHONE_SCR = {
    x0: PHONE_BODY.x + 1.6,
    x1: PHONE_BODY.x + PHONE_BODY.w - 1.6,
    z0: PZ0 + 2,
    z1: PZ0 + PH - 2,
    r: 1.4,
    depth: 1.0,
  };

  const appCards = [
    flatRect(SX + 3, PZ0 + 16, SX + 15, PZ0 + 21, 0.8, 3),
    flatRect(SX + 3, PZ0 + 10, SX + 15, PZ0 + 14.5, 0.8, 3),
    flatRect(SX + 3, PZ0 + 4, SX + 15, PZ0 + 8.5, 0.8, 3),
  ].join("");

  out.push(
    recessedWindow(
      PHONE_SCR,
      P_FRONT,
      `<path class="desk-screen-card" d="${appCards}"/><text class="desk-screen-title" x="${SX + 3}" y="${-(PZ0 + 23)}" font-size="2.8">CONTACT</text>`,
      "desk-screen-glass"
    )
  );

  // Notification Pulse LED at top of smartphone
  out.push(
    D([at([SX + 9, P_FRONT, PZ0 + PH - 1.2])], {
      size: 0.75,
      tone: "hi",
      pulse: true,
    })
  );

  return out.join("");
}

const SCENE_CACHE = new Map();

/**
 * Build the complete precomputed bedroom & study desk scene and 2D screen coordinates
 * for all 5 hotspot pins. Cached by `photoHref` for O(1) repeated renders.
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
      deskAndWall:
        buildRoomAndWindow() + buildLeftCabinet() + buildStudyDesk(),
      photo: buildWallPhoto(key),
      documents: buildDocumentsInLeftShelf(),
      notebook: buildBooksInLeftShelf(),
      cabinetFrontAndCrown: buildCabinetFrontAndCrown(),
      trophy: buildTrophyOnCabinet(),
      monitor: buildMonitorAndLaptop(),
      keyboardAndMouse: buildKeyboardAndMouse(),
      phone: buildSmartphoneOnStand(),
    },
  };

  SCENE_CACHE.set(key, scene);
  return scene;
}
