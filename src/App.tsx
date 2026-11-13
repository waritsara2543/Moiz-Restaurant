import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Edit3,
  Leaf,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

type MenuItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  tag?: string;
  image: string;
};

type AddonOption = { id: string; name: string; price: number };
type AddonGroup = {
  id: string;
  name: string;
  type: "single" | "multiple";
  required?: boolean;
  max?: number;
  options: AddonOption[];
};
type Selections = Record<string, string[]>;
type CartLine = {
  key: string;
  item: MenuItem;
  quantity: number;
  selections: Selections;
  instructions: string;
  addonTotal: number;
};
type Category = { name: string; subtitle: string; note: string };
type CustomizationDraft = {
  item: MenuItem;
  quantity: number;
  selections: Selections;
  instructions: string;
  editKey?: string;
};

const photos = {
  cover:
    "https://images.unsplash.com/photo-1663530761401-15eefb544889?auto=format&fit=crop&w=1400&q=90",
  starter:
    "https://images.unsplash.com/photo-1761315600943-d8a5bb0c499f?auto=format&fit=crop&w=1200&q=85",
  main: "https://images.unsplash.com/photo-1692197275441-40c874f40385?auto=format&fit=crop&w=1200&q=85",
  rice: "https://images.unsplash.com/photo-1791209135209-5fe1e8295b47?auto=format&fit=crop&w=1200&q=85",
  signature:
    "https://images.unsplash.com/photo-1621494268492-d01b98eba7e4?auto=format&fit=crop&w=1200&q=85",
  dessert:
    "https://images.unsplash.com/photo-1590741664176-7fbd7e2592a0?auto=format&fit=crop&w=1200&q=85",
  beverage:
    "https://images.unsplash.com/photo-1765646772493-7b5341714eea?auto=format&fit=crop&w=1200&q=85",
  steak: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85",
  chicken: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=85",
  pork: "https://images.unsplash.com/photo-1618164436241-4473940571cd?auto=format&fit=crop&w=1200&q=85",
  fried: "https://images.unsplash.com/photo-1599599810694-b5ac4dd47371?auto=format&fit=crop&w=1200&q=85",
};

const categories: Category[] = [
  { name: "ก่อนอาหารหลัก", subtitle: "การเริ่มต้นที่เล็กน้อย รสชาติที่สดใส", note: "จากไร่ไร่และชายฝั่ง" },
  { name: "อาหารหลัก", subtitle: "จากเตาไฟและสวน", note: "โต๊ะเย็นวันนี้" },
  { name: "ข้าวและก๋วยเตี๋ยว", subtitle: "ความสะดวกสบายที่รวมอยู่ในชาม", note: "ความอบอุ่นและพิธีกรรม" },
  {
    name: "จานอาหารโปรด",
    subtitle: "จานอาหารที่บอกเล่าเรื่องราวของเรา",
    note: "คอลเลกชันเฮ้าส์",
  },
  { name: "ของหวาน", subtitle: "หมายเหตุสุดท้ายที่ประณีต", note: "สิ่งที่หวาน" },
  { name: "เครื่องดื่ม", subtitle: "สารสกัด เทและการฟื้นตัว", note: "บทสุดท้าย" },
  { name: "สเต็ก", subtitle: "เมนูสร้างจุดขาย", note: "เนื้อสุกอย่างสมบูรณ์" },
  { name: "อาหารตามสั่ง", subtitle: "เมนูทำยอดประจำวัน", note: "รวดเร็วและอร่อย" },
  { name: "ของกินเล่น", subtitle: "เพิ่มยอดต่อบิล", note: "ของคู่กับอาหารหลัก" },
];

const dish = (
  id: string,
  category: string,
  name: string,
  description: string,
  price: number,
  image: string,
  tag?: string,
): MenuItem => ({ id, category, name, description, price, image, tag });

const menuItems: MenuItem[] = [
  dish(
    "s1",
    "ก่อนอาหารหลัก",
    "สวนที่เผาไฟ",
    "ผักสด ครีมอัลมอนด์รมควัน หอมแชบ่อนดอง และน้ำมันสมุนไพร",
    16,
    photos.starter,
    "แนะนำ",
  ),
  dish(
    "s2",
    "ก่อนอาหารหลัก",
    "เนื้อเหนือทะเล",
    "เนยน้ำตาล แอปเปิ้ลเขียว เซเลอร์แร็ก และสมุนไพรชายฝั่ง",
    22,
    photos.signature,
    "ขายดีที่สุด",
  ),
  dish(
    "s3",
    "ก่อนอาหารหลัก",
    "บูราต้าและมะเดื่อ",
    "บูราต้าฉีกมือ มะเดื่อย่าง โหระพา และน้ำมันบัลซามิก่อแก่เก่า",
    19,
    photos.dessert,
  ),
  dish(
    "m1",
    "อาหารหลัก",
    "เป็ดป่า",
    "เนื้อเป็ดแห้งอายุ หัวปลาย เชอรี่เปรี้ยว และซอสน้ำเกสร",
    38,
    photos.main,
    "ทางเลือกของเชฟ",
  ),
  dish(
    "m2",
    "อาหารหลัก",
    "ปลาบาส์ทะเลป่า",
    "ปลาบาส์จับตากลั่น ฟองกระโหลก หอยแมลงภู่ และซอสแชมเปญ",
    42,
    photos.signature,
  ),
  dish(
    "m3",
    "อาหารหลัก",
    "ฟักทองย่างไฟ",
    "ฟักทองเดลิก้า มิโซ กระเทียมสีดำ และเมล็ดข้าวคั่ว",
    29,
    photos.starter,
  ),
  dish(
    "r1",
    "ข้าวและก๋วยเตี๋ยว",
    "ข้าวเสฝอยดอกสน",
    "ข้าวกรอบที่ก้นกระถาง เห็ดป่า เสฝอยดอกสน และไข่เค็ม",
    28,
    photos.rice,
    "ขายดีที่สุด",
  ),
  dish(
    "r2",
    "ข้าวและก๋วยเตี๋ยว",
    "ก๋วยเตี๋ยวกุ้งมังกร",
    "ก๋วยเตี๋ยวชักมือ สปอนจ์ลูกกุ้งย่างและพริก",
    36,
    photos.signature,
    "เผ็ด",
  ),
  dish(
    "r3",
    "ข้าวและก๋วยเตี๋ยว",
    "อูดง่าแทรฟเฟิล",
    "อูดงนุ่มสำไร้ แทรฟเฟิลตามฤดูกาล เนยคมบ และหอม",
    31,
    photos.rice,
  ),
  dish(
    "g1",
    "จานอาหารโปรด",
    "เวลลิงตันของ The Dining Book",
    "เนื้อวัว ดักเซลเห็ด พuff pastry ทองและซอสไวน์แดง",
    58,
    photos.cover,
    "โปรด",
  ),
  dish(
    "g2",
    "จานอาหารโปรด",
    "แกะเผาไฟสน",
    "ไก่ขนไข่เคลือบเงา พริกหมัก หัวหอม และมิント",
    48,
    photos.main,
  ),
  dish(
    "g3",
    "จานอาหารโปรด",
    "ปลาคอดมิโซสีดำ",
    "ปลาคอดหมักมิโซ 72 ชั่วโมง วิสคี้แดร์ คาราว่ะ และดาชิตะมารินส",
    44,
    photos.signature,
    "แนะนำ",
  ),
  dish(
    "d1",
    "ของหวาน",
    "ช็อกโกแลตยามค่ำคืน",
    "ช็อกโกแลตดำ crémeux น้ำหมี่ไหม่ไม้ และเกล็ดเกลือทะเล",
    18,
    photos.dessert,
    "ขายดีที่สุด",
  ),
  dish(
    "d2",
    "ของหวาน",
    "แพร์และดอกเอลเดอร์ฟลาวเวอร์",
    "แพร์ต้ม ไอศกรีมดอกเอลเดอร์ฟลาวเวอร์ อัลมอนด์ และเลมอนเวอร์บีนา",
    17,
    photos.dessert,
  ),
  dish(
    "d3",
    "ของหวาน",
    "วนิลลา Mille-Feuille",
    "พuff pastry คาราเมลไลซ์ วนิลลาตาฮิติ และครีมดนตรี",
    19,
    photos.dessert,
  ),
  dish(
    "b1",
    "เครื่องดื่ม",
    "สวนเลขที่ 7",
    "Seedlip สวน แตงกวา ดอกเอลเดอร์ฟลาวเวอร์ และเทนิก",
    12,
    photos.beverage,
  ),
  dish(
    "b2",
    "เครื่องดื่ม",
    "Spritz สีส้มเผาไฟ",
    "ส้มขมาว verjus โรสแมรี่ และน้ำเหลือบ",
    13,
    photos.beverage,
  ),
  dish(
    "b3",
    "เครื่องดื่ม",
    "ชาเจสมินมุกลูก",
    "เจสมินมุกลูกทั้งหมด สำหรับชงเบา ๆ และเสิร์ฟที่โต๊ะอาหาร",
    9,
    photos.beverage,
  ),
  // สเต็ก (เมนูสร้างจุดขาย)
  dish(
    "st1",
    "สเต็ก",
    "สเต็กไก่",
    "เนื้อไก่อ่อนและนุ่ม ย่างจนอร่อย",
    69,
    photos.chicken,
  ),
  dish(
    "st2",
    "สเต็ก",
    "สเต็กหมู",
    "เนื้อหมูสดใหม่ ย่างจนหอม",
    89,
    photos.pork,
  ),
  dish(
    "st3",
    "สเต็ก",
    "พอร์กชอป",
    "ซี่โครงหมูย่าง นุ่ม ชุ่มน้ำ",
    119,
    photos.pork,
    "พิเศษ",
  ),
  dish(
    "st4",
    "สเต็ก",
    "สเต็กไก่พริกไทยดำ",
    "เนื้อไก่โรยพริกไทยดำ รสชาติเข้มข้น",
    79,
    photos.chicken,
  ),
  dish(
    "st5",
    "สเต็ก",
    "สเต็กหมูซอสเห็ด",
    "เนื้อหมูเยิ้มซอสเห็ด อาหารคลาสสิก",
    99,
    photos.pork,
  ),
  dish(
    "st6",
    "สเต็ก",
    "สเต็กปลา",
    "ปลาสดใหม่ย่างจนเหน่อ เนื้อนุ่ม",
    99,
    photos.main,
  ),
  // อาหารตามสั่ง (เมนูทำยอดประจำวัน)
  dish(
    "or1",
    "อาหารตามสั่ง",
    "ข้าวกะเพรา",
    "ข้าวกะเพราหมู ไข่ดาวสุกตามใจ",
    45,
    photos.rice,
    "ขายดี",
  ),
  dish(
    "or2",
    "อาหารตามสั่ง",
    "ข้าวผัด",
    "ข้าวผัดรามคำแหง สดชื่นและอร่อย",
    45,
    photos.rice,
  ),
  dish(
    "or3",
    "อาหารตามสั่ง",
    "ข้าวผัดพริกแกง",
    "ข้าวผัดด้วยพริกแกงแดง เผ็ด",
    50,
    photos.rice,
  ),
  dish(
    "or4",
    "อาหารตามสั่ง",
    "ข้าวหมูกระเทียม",
    "หมูทอดกรอบ กระเทียมหอม ราดข้าว",
    50,
    photos.rice,
  ),
  dish(
    "or5",
    "อาหารตามสั่ง",
    "ข้าวไก่ทอด",
    "ไก่ทอดกรอบ สีทองสวยงาม",
    50,
    photos.chicken,
    "ขายดี",
  ),
  dish(
    "or6",
    "อาหารตามสั่ง",
    "ข้าวไข่ข้น",
    "ข้าวผัดไข่ข้นเครื่องแน่นๆ หอม",
    50,
    photos.rice,
  ),
  // ของกินเล่น (เพิ่มยอดต่อบิล)
  dish(
    "sn1",
    "ของกินเล่น",
    "เฟรนช์ฟรายส์",
    "มันฝรั่งทอดกรอบ เค็ม หวาน",
    39,
    photos.fried,
  ),
  dish(
    "sn2",
    "ของกินเล่น",
    "นักเก็ตไก่",
    "นักเก็ตไก่นุ่มจากไร่",
    49,
    photos.chicken,
    "นิยม",
  ),
  dish(
    "sn3",
    "ของกินเล่น",
    "ไส้กรอกทอด",
    "ไส้กรอกแฟรงก์เฟิร์ตทอดกรอบ",
    39,
    photos.pork,
  ),
  dish(
    "sn4",
    "ของกินเล่น",
    "เฟรนช์ฟรายส์ชีส",
    "มันฝรั่งทอด เสาะชีสหลอม",
    49,
    photos.fried,
  ),
  dish(
    "sn5",
    "ของกินเล่น",
    "ขนมปังกระเทียม",
    "ขนมปังย่าง เนยกระเทียม หอม",
    39,
    photos.main,
  ),
];

const savoryAddonGroups: AddonGroup[] = [
  {
    id: "toppings",
    name: "ท็อปปิ้งเพิ่มเติม",
    type: "multiple",
    max: 3,
    options: [
      { id: "fried-egg", name: "ไข่ไก่เจียว", price: 15 },
      { id: "cheese", name: "ชีส", price: 20 },
      { id: "extra-meat", name: "เนื้อเพิ่มเติม", price: 30 },
      { id: "extra-vegetables", name: "ผักสดเพิ่มเติม", price: 15 },
      { id: "extra-rice", name: "ข้าวเพิ่มเติม", price: 10 },
    ],
  },
  {
    id: "spice",
    name: "ระดับความเผ็ด",
    type: "single",
    required: true,
    options: [
      { id: "not-spicy", name: "ไม่เผ็ด", price: 0 },
      { id: "mild", name: "เบาน้อย", price: 0 },
      { id: "medium", name: "ปานกลาง", price: 0 },
      { id: "very-spicy", name: "เผ็ดมาก", price: 0 },
    ],
  },
  {
    id: "choices",
    name: "ตัวเลือกเพิ่มเติม",
    type: "multiple",
    max: 2,
    options: [
      { id: "no-onion", name: "ไม่มีหอม", price: 0 },
      { id: "no-vegetables", name: "ไม่มีผัก", price: 0 },
      { id: "extra-sauce", name: "ซอสเพิ่มเติม", price: 10 },
      { id: "sauce-side", name: "ซอสแยกด้านข้าง", price: 0 },
    ],
  },
];

const dessertAddonGroups: AddonGroup[] = [
  {
    id: "toppings",
    name: "จบท้ายอย่างสวยงาม",
    type: "multiple",
    max: 3,
    options: [
      { id: "ice-cream", name: "ไอศกรีมวนิลลา", price: 20 },
      { id: "berries", name: "เบอร์รี่สดใหม่", price: 25 },
      { id: "chocolate", name: "ซอสช็อกโกแลต", price: 10 },
      { id: "cream", name: "ครีมดนตรี", price: 15 },
    ],
  },
  {
    id: "serving",
    name: "ความชอบในการเสิร์ฟ",
    type: "single",
    required: true,
    options: [
      { id: "as-designed", name: "ตามดีไซน์", price: 0 },
      { id: "less-sweet", name: "หวานน้อยกว่า", price: 0 },
    ],
  },
];

const beverageAddonGroups: AddonGroup[] = [
  {
    id: "sweetness",
    name: "ความหวาน",
    type: "single",
    required: true,
    options: [
      { id: "no-sugar", name: "ไม่มีน้ำตาล", price: 0 },
      { id: "half-sweet", name: "หวานครึ่ง", price: 0 },
      { id: "regular", name: "ปกติ", price: 0 },
    ],
  },
  {
    id: "extras",
    name: "ตัวเลือกเพิ่มเติม",
    type: "multiple",
    max: 2,
    options: [
      { id: "extra-shot", name: "ช็อตเพิ่มเติม", price: 20 },
      { id: "sparkling", name: "ทำให้เหลือบ", price: 15 },
      { id: "no-ice", name: "ไม่มีน้ำแข็ง", price: 0 },
      { id: "lemon", name: "เลมอนสดใหม่", price: 10 },
    ],
  },
];

const getAddonGroups = (item: MenuItem) =>
  item.category === "Desserts"
    ? dessertAddonGroups
    : item.category === "Beverages"
      ? beverageAddonGroups
      : savoryAddonGroups;

const getDefaultSelections = (groups: AddonGroup[]): Selections =>
  Object.fromEntries(groups.map((group) => [group.id, []]));

const selectedOptions = (item: MenuItem, selections: Selections) =>
  getAddonGroups(item).flatMap((group) =>
    group.options.filter((option) => selections[group.id]?.includes(option.id)),
  );

const addonPrice = (item: MenuItem, selections: Selections) =>
  selectedOptions(item, selections).reduce((total, option) => total + option.price, 0);

const customizationKey = (item: MenuItem, selections: Selections, instructions: string) =>
  `${item.id}|${Object.entries(selections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, values]) => `${group}:${[...values].sort().join(",")}`)
    .join("|")}|${instructions.trim().toLowerCase()}`;

const money = (value: number) => `฿${value.toFixed(2)}`;

function Monogram({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`monogram ${inverse ? "monogram-inverse" : ""}`} aria-label="The Dining Book">
      <span>ท</span>
      <i />
      <span>บ</span>
    </div>
  );
}

function Quantity({
  value,
  onChange,
  compact = false,
}: {
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={`qty ${compact ? "qty-small" : ""}`} aria-label="ปริมาณ">
      <button onClick={() => onChange(Math.max(1, value - 1))} aria-label="ลดปริมาณ">
        <Minus size={compact ? 12 : 14} />
      </button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="เพิ่มปริมาณ">
        <Plus size={compact ? 12 : 14} />
      </button>
    </div>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [turning, setTurning] = useState<"forward" | "back" | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [customizing, setCustomizing] = useState<CustomizationDraft | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);
  const subtotal = cart.reduce(
    (total, line) => total + (line.item.price + line.addonTotal) * line.quantity,
    0,
  );
  const currentCategory = chapter > 0 ? categories[chapter - 1] : null;
  const currentItems = currentCategory
    ? menuItems.filter((item) => item.category === currentCategory.name)
    : [];

  const goTo = (next: number) => {
    if (next < 0 || next > categories.length || next === chapter || turning) return;
    setTurning(next > chapter ? "forward" : "back");
    window.setTimeout(() => {
      setChapter(next);
      window.scrollTo({ top: 0, behavior: "instant" });
      window.setTimeout(() => setTurning(null), 230);
    }, 220);
  };

  const openCustomizer = (item: MenuItem) => {
    setCustomizing({
      item,
      quantity: quantities[item.id] || 1,
      selections: getDefaultSelections(getAddonGroups(item)),
      instructions: "",
    });
  };

  const saveCustomization = (draft: CustomizationDraft) => {
    const key = customizationKey(draft.item, draft.selections, draft.instructions);
    const configuredLine: CartLine = {
      key,
      item: draft.item,
      quantity: draft.quantity,
      selections: draft.selections,
      instructions: draft.instructions.trim(),
      addonTotal: addonPrice(draft.item, draft.selections),
    };
    setCart((lines) => {
      const withoutEdited = draft.editKey
        ? lines.filter((line) => line.key !== draft.editKey)
        : lines;
      const existing = withoutEdited.find((line) => line.key === key);
      return existing
        ? withoutEdited.map((line) =>
            line.key === key
              ? { ...line, quantity: line.quantity + configuredLine.quantity }
              : line,
          )
        : [...withoutEdited, configuredLine];
    });
    setQuantities((values) => ({ ...values, [draft.item.id]: 1 }));
    setJustAdded(draft.item.id);
    setCustomizing(null);
    if (draft.editKey) setCartOpen(true);
    window.setTimeout(() => setJustAdded((id) => (id === draft.item.id ? null : id)), 1100);
  };

  const updateLine = (key: string, quantity: number) =>
    setCart((lines) => lines.map((line) => (line.key === key ? { ...line, quantity } : line)));

  const editLine = (line: CartLine) => {
    setCartOpen(false);
    setCustomizing({
      item: line.item,
      quantity: line.quantity,
      selections: line.selections,
      instructions: line.instructions,
      editKey: line.key,
    });
  };

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!opened || cartOpen || indexOpen || customizing) return;
      if (event.key === "ArrowRight") goTo(Math.min(categories.length, chapter + 1));
      if (event.key === "ArrowLeft") goTo(Math.max(0, chapter - 1));
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [opened, cartOpen, indexOpen, customizing, chapter, turning]);

  const orderNumber = useMemo(() => `DB-${String(2840 + cartCount).padStart(4, "0")}`, [confirmed]);

  if (confirmed) {
    return (
      <main className="confirmation">
        <article className="receipt">
          <Monogram />
          <div className="receipt-seal">
            <Check size={26} />
          </div>
          <p className="kicker">สั่งซื้อได้รับแล้ว · โต๊ะ 12</p>
          <h1>
            ขอบคุณ
            <br />
            ครัวได้รับคำสั่งของคุณแล้ว
          </h1>
          <p className="receipt-intro">
            ยั่งยืน กำหนดที่นั่ง เราจะนำจานอาหารแต่ละจานมายังโต๊ะเมื่อพร้อม
          </p>
          <div className="receipt-meta">
            <span>
              สั่งซื้อ <b>{orderNumber}</b>
            </span>
            <span>
              สถานะ{" "}
              <b>
                <i /> กำลังเตรียม
              </b>
            </span>
          </div>
          <div className="receipt-lines">
            {cart.map((line) => (
              <div key={line.key}>
                <span>
                  {line.quantity} × {line.item.name}
                </span>
                <span>{money((line.item.price + line.addonTotal) * line.quantity)}</span>
              </div>
            ))}
            <div className="receipt-total">
              <span>รวมทั้งสิ้น</span>
              <span>{money(subtotal)}</span>
            </div>
          </div>
          <button
            className="underlined-action"
            onClick={() => {
              setCart([]);
              setConfirmed(false);
              setChapter(0);
            }}
          >
            กลับไปยังหนังสือ <ArrowRight size={15} />
          </button>
        </article>
      </main>
    );
  }

  if (!opened) {
    return (
      <main className="cover-scene">
        <div className="table-light" />
        <article className="cover">
          <img src={photos.cover} alt="เชฟนำเสนอจานอาหารตามฤดูกาล" />
          <div className="cover-wash" />
          <div className="cover-frame" />
          <header>
            <Monogram inverse />
            <span>ครัวตามฤดูกาล · ก่อตั้ง 2018</span>
          </header>
          <div className="cover-copy">
            <p>โต๊ะสิบสองเสนอ</p>
            <h1>
              หนังสือ
              <br />
              ร้านอาหาร
              <br />
              ของเรา
            </h1>
            <div className="cover-leaf">
              <span />
              <Leaf size={17} />
              <span />
            </div>
            <p className="cover-tagline">
              คอลเลกชันจากครัวของเรา
              <br />
              เขียนโดยฤดูกาล
            </p>
          </div>
          <button className="open-menu" onClick={() => setOpened(true)}>
            เปิดเมนู <ArrowRight size={17} />
          </button>
          <small>ฤดูใบไม้ผลิ · ฉบับพอ</small>
        </article>
      </main>
    );
  }

  return (
    <main className="menu-scene">
      <div className="menu-utility">
        <button className="mini-brand" onClick={() => goTo(0)}>
          <Monogram />
        </button>
        <button className="chapter-trigger" onClick={() => setIndexOpen(true)}>
          <span>{chapter === 0 ? "ยินดีต้อนรับ" : currentCategory?.name}</span>
          <ChevronDown size={14} />
        </button>
        <div className="table-label">
          โต๊ะ <b>12</b>
        </div>
      </div>

      <section
        className={`book ${turning ? `book-turn-${turning}` : ""}`}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          if (!touchStart.current) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - touchStart.current.x;
          const dy = touch.clientY - touchStart.current.y;
          if (Math.abs(dx) > 58 && Math.abs(dx) > Math.abs(dy) * 1.25) {
            goTo(dx < 0 ? Math.min(categories.length, chapter + 1) : Math.max(0, chapter - 1));
          }
          touchStart.current = null;
        }}
      >
        <div className="book-edge" />
        {chapter === 0 ? (
          <WelcomePage onStart={() => goTo(1)} />
        ) : (
          <ChapterPage
            category={currentCategory!}
            items={currentItems}
            page={chapter}
            quantities={quantities}
            justAdded={justAdded}
            setQuantity={(id, quantity) =>
              setQuantities((values) => ({ ...values, [id]: quantity }))
            }
            onCustomize={openCustomizer}
          />
        )}
      </section>

      <BookNavigation chapter={chapter} total={categories.length} goTo={goTo} />

      <button className="my-order" onClick={() => setCartOpen(true)}>
        <span>
          <ShoppingBag size={17} /> คำสั่งของฉัน
        </span>
        <b>{cartCount ? `${cartCount} · ${money(subtotal)}` : "0 รายการ"}</b>
      </button>

      <ChapterIndex
        open={indexOpen}
        chapter={chapter}
        onClose={() => setIndexOpen(false)}
        onSelect={(index) => {
          setIndexOpen(false);
          goTo(index);
        }}
      />

      <OrderSheet
        open={cartOpen}
        cart={cart}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        updateLine={updateLine}
        editLine={editLine}
        removeLine={(key) => setCart((lines) => lines.filter((line) => line.key !== key))}
        onConfirm={() => {
          setCartOpen(false);
          setConfirmed(true);
        }}
      />
      {customizing && (
        <CustomizationPanel
          key={`${customizing.item.id}-${customizing.editKey || "new"}`}
          draft={customizing}
          onClose={() => {
            const wasEditing = Boolean(customizing.editKey);
            setCustomizing(null);
            if (wasEditing) setCartOpen(true);
          }}
          onSave={saveCustomization}
        />
      )}
      {(cartOpen || indexOpen || customizing) && (
        <button
          className="backdrop"
          aria-label="ปิดการซ้อน"
          onClick={() => {
            setCartOpen(false);
            setIndexOpen(false);
            setCustomizing(null);
          }}
        />
      )}
    </main>
  );
}

function WelcomePage({ onStart }: { onStart: () => void }) {
  return (
    <>
      <div className="mobile-page welcome-page">
        <PageFolio label="ยินดีต้อนรับ" page={1} />
        <div className="welcome-art">
          <p className="kicker">สวัสดีตอนเย็น</p>
          <h2>
            โต๊ะตั้งค่า
            <br />
            สำหรับฤดูกาล
          </h2>
          <div className="ornament">
            <span />
            <Leaf size={15} />
            <span />
          </div>
          <p className="welcome-intro">
            เมนูของเราเป็นเรื่องราวของไร่นา ไฟ และชายฝั่ง จานอาหารแต่ละจานทำมาเพื่อแบ่งปัน คุยกัน และจดจำ
          </p>
          <div className="welcome-image">
            <img src={photos.main} alt="จานอาหารตามฤดูกาลจากครัว" />
            <span>เก็บเกี่ยวฤดูใบไม้ผลิ · The Dining Book</span>
          </div>
          <div className="welcome-note">
            <span>โต๊ะของคุณ</span>
            <b>12</b>
            <small>ห้องระเบียง · บริการยามค่ำคืน</small>
          </div>
          <button className="underlined-action" onClick={onStart}>
            เริ่มต้นด้วยสตาร์ทเตอร์ <ArrowRight size={15} />
          </button>
        </div>
        <PageFooter page={1} />
      </div>
      <div className="desktop-spread welcome-spread">
        <article className="spread-page spread-welcome">
          <PageFolio label="The Dining Book" page={1} />
          <p className="kicker">สวัสดีตอนเย็น</p>
          <h2>
            โต๊ะตั้งค่า
            <br />
            สำหรับฤดูกาล
          </h2>
          <p className="welcome-intro">
            เมนูของเราเป็นเรื่องราวของไร่นา ไฟ และชายฝั่ง จานอาหารแต่ละจานทำมาเพื่อแบ่งปัน คุยกัน และจดจำ
          </p>
          <div className="welcome-note">
            <span>โต๊ะของคุณ</span>
            <b>12</b>
            <small>ห้องระเบียง · บริการยามค่ำคืน</small>
          </div>
          <PageFooter page={1} />
        </article>
        <article className="spread-page spread-photo">
          <PageFolio label="บันทึกจากครัว" page={2} />
          <img src={photos.main} alt="จานอาหารตามฤดูกาลจากครัว" />
          <blockquote>
            "ปล่อยให้วัตถุดิบพูดเพื่อตัวเอง และให้ความรู้สึกของสถานที่แต่ละหลักสูตร"
          </blockquote>
          <p>— Elias Rowe, Executive Chef</p>
          <button className="underlined-action" onClick={onStart}>
            เริ่มเมนู <ArrowRight size={15} />
          </button>
          <PageFooter page={2} />
        </article>
      </div>
    </>
  );
}

function ChapterPage({
  category,
  items,
  page,
  quantities,
  justAdded,
  setQuantity,
  onCustomize,
}: {
  category: Category;
  items: MenuItem[];
  page: number;
  quantities: Record<string, number>;
  justAdded: string | null;
  setQuantity: (id: string, quantity: number) => void;
  onCustomize: (item: MenuItem) => void;
}) {
  const featured = items[0];
  return (
    <>
      <article className="mobile-page chapter-page">
        <PageFolio label={`บทที่ 0${page}`} page={page + 1} />
        <ChapterHeading category={category} page={page} />
        <FeaturedDish
          item={featured}
          quantity={quantities[featured.id] || 1}
          added={justAdded === featured.id}
          setQuantity={(value) => setQuantity(featured.id, value)}
          add={() => onCustomize(featured)}
        />
        <div className="supporting-dishes">
          {items.slice(1).map((item) => (
            <SupportingDish
              key={item.id}
              item={item}
              quantity={quantities[item.id] || 1}
              added={justAdded === item.id}
              setQuantity={(value) => setQuantity(item.id, value)}
              add={() => onCustomize(item)}
            />
          ))}
        </div>
        <p className="dietary-note">
          <Leaf size={12} /> โปรดแจ้งให้เราทราบเกี่ยวกับข้อกำหนดด้านอาหาร
        </p>
        <PageFooter page={page + 1} />
      </article>

      <div className="desktop-spread chapter-spread">
        <article className="spread-page">
          <PageFolio label={`บทที่ 0${page}`} page={page * 2} />
          <ChapterHeading category={category} page={page} />
          <FeaturedDish
            item={featured}
            quantity={quantities[featured.id] || 1}
            added={justAdded === featured.id}
            setQuantity={(value) => setQuantity(featured.id, value)}
            add={() => onCustomize(featured)}
          />
          <PageFooter page={page * 2} />
        </article>
        <article className="spread-page spread-menu">
          <PageFolio label={category.note} page={page * 2 + 1} />
          <p className="kicker">จากบทนี้</p>
          <h2>{category.name}</h2>
          <div className="ornament">
            <span />
            <Leaf size={14} />
            <span />
          </div>
          <div className="supporting-dishes">
            {items.slice(1).map((item) => (
              <SupportingDish
                key={item.id}
                item={item}
                quantity={quantities[item.id] || 1}
                added={justAdded === item.id}
                setQuantity={(value) => setQuantity(item.id, value)}
                add={() => onCustomize(item)}
              />
            ))}
          </div>
          <p className="dietary-note">
            <Leaf size={12} /> โปรดแจ้งให้เราทราบเกี่ยวกับข้อกำหนดด้านอาหาร
          </p>
          <PageFooter page={page * 2 + 1} />
        </article>
      </div>
    </>
  );
}

function ChapterHeading({ category, page }: { category: Category; page: number }) {
  return (
    <header className="chapter-heading">
      <span>0{page}</span>
      <div>
        <p>{category.note}</p>
        <h2>{category.name}</h2>
        <small>{category.subtitle}</small>
      </div>
    </header>
  );
}

function FeaturedDish({
  item,
  quantity,
  added,
  setQuantity,
  add,
}: {
  item: MenuItem;
  quantity: number;
  added: boolean;
  setQuantity: (value: number) => void;
  add: () => void;
}) {
  return (
    <section className="featured-dish">
      <div className="featured-photo">
        <img src={item.image} alt={item.name} />
        <span>{item.tag || "Seasonal selection"}</span>
      </div>
      <div className="dish-title">
        <div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
        <b>{money(item.price)}</b>
      </div>
      <DishAction quantity={quantity} added={added} setQuantity={setQuantity} add={add} />
    </section>
  );
}

function SupportingDish({
  item,
  quantity,
  added,
  setQuantity,
  add,
}: {
  item: MenuItem;
  quantity: number;
  added: boolean;
  setQuantity: (value: number) => void;
  add: () => void;
}) {
  return (
    <article className="supporting-dish">
      <img src={item.image} alt={item.name} />
      <div className="supporting-copy">
        {item.tag && <span className="dish-label">{item.tag}</span>}
        <div className="dish-name-row">
          <h3>{item.name}</h3>
          <b>{money(item.price)}</b>
        </div>
        <p>{item.description}</p>
        <DishAction compact quantity={quantity} added={added} setQuantity={setQuantity} add={add} />
      </div>
    </article>
  );
}

function DishAction({
  quantity,
  added,
  setQuantity,
  add,
  compact = false,
}: {
  quantity: number;
  added: boolean;
  setQuantity: (value: number) => void;
  add: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`dish-action ${compact ? "dish-action-small" : ""}`}>
      <Quantity compact={compact} value={quantity} onChange={setQuantity} />
      <button className={added ? "added" : ""} onClick={add}>
        {added ? (
          <>
            <Check size={13} /> เพิ่มแล้ว
          </>
        ) : (
          <>
            เพิ่ม <Plus size={13} />
          </>
        )}
      </button>
    </div>
  );
}

function PageFolio({ label, page }: { label: string; page: number }) {
  return (
    <div className="page-folio">
      <span>{label}</span>
      <span>เล่ม I · {String(page).padStart(2, "0")}</span>
    </div>
  );
}

function PageFooter({ page }: { page: number }) {
  return (
    <div className="page-footer">
      <span>The Dining Book</span>
      <b>{String(page).padStart(2, "0")}</b>
    </div>
  );
}

function BookNavigation({
  chapter,
  total,
  goTo,
}: {
  chapter: number;
  total: number;
  goTo: (page: number) => void;
}) {
  return (
    <nav className="book-navigation" aria-label="การนำทางหน้า">
      <button onClick={() => goTo(chapter - 1)} disabled={chapter === 0} aria-label="หน้าก่อนหน้า">
        <ArrowLeft size={17} />
      </button>
      <div className="page-progress">
        {Array.from({ length: total + 1 }, (_, index) => (
          <button
            key={index}
            className={index === chapter ? "active" : ""}
            onClick={() => goTo(index)}
            aria-label={`ไปที่หน้า ${index + 1}`}
          />
        ))}
      </div>
      <button onClick={() => goTo(chapter + 1)} disabled={chapter === total} aria-label="หน้าถัดไป">
        <ArrowRight size={17} />
      </button>
    </nav>
  );
}

function ChapterIndex({
  open,
  chapter,
  onClose,
  onSelect,
}: {
  open: boolean;
  chapter: number;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <aside className={`chapter-index ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <header>
        <div>
          <p className="kicker">The Dining Book</p>
          <h2>ดัชนีบท</h2>
        </div>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </header>
      <button className={chapter === 0 ? "active" : ""} onClick={() => onSelect(0)}>
        <span>01</span>
        <b>ยินดีต้อนรับ</b>
        <small>ที่โต๊ะ</small>
      </button>
      {categories.map((category, index) => (
        <button
          key={category.name}
          className={chapter === index + 1 ? "active" : ""}
          onClick={() => onSelect(index + 1)}
        >
          <span>{String(index + 2).padStart(2, "0")}</span>
          <b>{category.name}</b>
          <small>{category.note}</small>
        </button>
      ))}
    </aside>
  );
}

function CustomizationPanel({
  draft,
  onClose,
  onSave,
}: {
  draft: CustomizationDraft;
  onClose: () => void;
  onSave: (draft: CustomizationDraft) => void;
}) {
  const [quantity, setQuantity] = useState(draft.quantity);
  const [selections, setSelections] = useState<Selections>(draft.selections);
  const [instructions, setInstructions] = useState(draft.instructions);
  const [showErrors, setShowErrors] = useState(false);
  const groups = getAddonGroups(draft.item);
  const extras = addonPrice(draft.item, selections);
  const total = (draft.item.price + extras) * quantity;
  const missingRequired = groups.filter((group) => group.required && !selections[group.id]?.length);

  const toggleOption = (group: AddonGroup, optionId: string) => {
    setSelections((current) => {
      const selected = current[group.id] || [];
      if (group.type === "single") return { ...current, [group.id]: [optionId] };
      if (selected.includes(optionId)) {
        return { ...current, [group.id]: selected.filter((id) => id !== optionId) };
      }
      if (group.max && selected.length >= group.max) return current;
      return { ...current, [group.id]: [...selected, optionId] };
    });
  };

  const submit = () => {
    if (missingRequired.length) {
      setShowErrors(true);
      document
        .querySelector(`[data-addon-group="${missingRequired[0].id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onSave({ ...draft, quantity, selections, instructions });
  };

  return (
    <aside className="customization-panel" aria-modal="true" role="dialog">
      <header className="customization-hero">
        <img src={draft.item.image} alt={draft.item.name} />
        <button onClick={onClose} aria-label="ปิดการปรับแต่ง">
          <X size={20} />
        </button>
        <div>
          <p className="kicker">{draft.editKey ? "แก้ไขทางเลือก" : "ประกอบจานอาหารของคุณ"}</p>
          <h2>{draft.item.name}</h2>
          <p>{draft.item.description}</p>
          <b>ราคาพื้นฐาน · {money(draft.item.price)}</b>
        </div>
      </header>

      <div className="customization-content">
        <div className="customization-intro">
          <span>ตัวเลือก</span>
          <p>ทำให้จานนี้ตรงตามที่คุณต้องการ</p>
        </div>
        {groups.map((group, groupIndex) => {
          const count = selections[group.id]?.length || 0;
          const hasError = showErrors && group.required && count === 0;
          return (
            <fieldset
              className={`addon-group ${hasError ? "has-error" : ""}`}
              key={group.id}
              data-addon-group={group.id}
            >
              <legend>
                <span>
                  <i>0{groupIndex + 1}</i>
                  {group.name}
                </span>
                <small>
                  {group.required
                    ? "เลือก 1 · จำเป็น"
                    : group.max
                      ? `เลือกได้ถึง ${group.max} · ไม่บังคับ`
                      : "ไม่บังคับ"}
                </small>
              </legend>
              {group.options.map((option) => {
                const checked = selections[group.id]?.includes(option.id) || false;
                const limitReached =
                  group.type === "multiple" && Boolean(group.max && count >= group.max) && !checked;
                return (
                  <label className={limitReached ? "option-disabled" : ""} key={option.id}>
                    <input
                      type={group.type === "single" ? "radio" : "checkbox"}
                      name={group.id}
                      checked={checked}
                      disabled={limitReached}
                      onChange={() => toggleOption(group, option.id)}
                    />
                    <span className={`selection-mark ${group.type}`}>
                      <Check size={11} />
                    </span>
                    <b>{option.name}</b>
                    <em>{option.price ? `+${money(option.price)}` : "รวม"}</em>
                  </label>
                );
              })}
              {hasError && <p className="selection-error">โปรดเลือกตัวเลือกหนึ่ง</p>}
            </fieldset>
          );
        })}
        <label className="instructions-field">
          <span>
            คำแนะนำพิเศษ <small>ไม่บังคับ</small>
          </span>
          <textarea
            value={instructions}
            maxLength={160}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="มีอะไรอื่นที่ครัวของเราควรรู้ไหม"
          />
          <small>{instructions.length}/160</small>
        </label>
        <div className="price-notes">
          <span>
            ราคาพื้นฐาน <b>{money(draft.item.price)}</b>
          </span>
          <span>
            เพิ่มเติม <b>{money(extras)}</b>
          </span>
        </div>
      </div>

      <footer className="customization-footer">
        <Quantity value={quantity} onChange={setQuantity} />
        <button onClick={submit}>
          <span>{draft.editKey ? "ปรับปรุงคำสั่ง" : "เพิ่มเพื่อสั่งซื้อ"}</span>
          <b>{money(total)}</b>
        </button>
      </footer>
    </aside>
  );
}

function OrderSheet({
  open,
  cart,
  subtotal,
  onClose,
  updateLine,
  editLine,
  removeLine,
  onConfirm,
}: {
  open: boolean;
  cart: CartLine[];
  subtotal: number;
  onClose: () => void;
  updateLine: (key: string, quantity: number) => void;
  editLine: (line: CartLine) => void;
  removeLine: (key: string) => void;
  onConfirm: () => void;
}) {
  return (
    <aside className={`order-sheet ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="sheet-handle" />
      <header>
        <div>
          <p className="kicker">โต๊ะ 12 · สัญญาลำดับ</p>
          <h2>คำสั่งของฉัน</h2>
        </div>
        <button onClick={onClose} aria-label="ปิดลำดับ">
          <X size={21} />
        </button>
      </header>
      {cart.length === 0 ? (
        <div className="empty-order">
          <ShoppingBag size={29} strokeWidth={1.3} />
          <h3>แผ่นคำสั่งของคุณว่างเปล่า</h3>
          <p>เลือกจานอาหารจากหนังสือและจะเขียนไว้ที่นี่</p>
          <button className="underlined-action" onClick={onClose}>
            กลับไปเมนู <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <>
          <div className="order-lines">
            {cart.map((line) => (
              <article className="order-line" key={line.key}>
                <img src={line.item.image} alt="" />
                <div>
                  <div className="order-line-title">
                    <h3>{line.item.name}</h3>
                    <b>{money((line.item.price + line.addonTotal) * line.quantity)}</b>
                  </div>
                  <div className="line-pricing">
                    <span>ฐาน {money(line.item.price)}</span>
                    {line.addonTotal > 0 && <span>เพิ่มเติม +{money(line.addonTotal)}</span>}
                  </div>
                  <ul className="line-options">
                    {getAddonGroups(line.item).map((group) => {
                      const options = group.options.filter((option) =>
                        line.selections[group.id]?.includes(option.id),
                      );
                      return options.length ? (
                        <li key={group.id}>
                          <span>{group.name}</span>
                          <b>
                            {options
                              .map(
                                (option) =>
                                  `${option.name}${option.price ? ` (+${money(option.price)})` : ""}`,
                              )
                              .join(", ")}
                          </b>
                        </li>
                      ) : null;
                    })}
                    {line.instructions && (
                      <li>
                        <span>หมายเหตุ</span>
                        <b>“{line.instructions}”</b>
                      </li>
                    )}
                  </ul>
                  <div className="order-line-controls">
                    <Quantity
                      compact
                      value={line.quantity}
                      onChange={(quantity) => updateLine(line.key, quantity)}
                    />
                    <div>
                      <button onClick={() => editLine(line)}>
                        <Edit3 size={12} /> แก้ไข
                      </button>
                      <button onClick={() => removeLine(line.key)}>
                        <Trash2 size={12} /> ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <footer className="order-total">
            <div>
              <span>ผลรวมย่อย</span>
              <span>{money(subtotal)}</span>
            </div>
            <div>
              <span>บริการ</span>
              <span>รวม</span>
            </div>
            <div className="total">
              <span>รวมทั้งสิ้น</span>
              <b>{money(subtotal)}</b>
            </div>
            <button onClick={onConfirm}>
              ยืนยันคำสั่ง <ArrowRight size={17} />
            </button>
            <small>คำสั่งของคุณจะถูกส่งไปยังครัวของเราโดยตรง</small>
          </footer>
        </>
      )}
    </aside>
  );
}
