export interface Partner {
  id: number;
  name: string;
  description: string;
  logo: string;
  location: string;
  rating: number;
  category: string;
  workingHours: string;
  cuisine?: string;
  specialties?: string[];
}

export const partnersData: Partner[] = [
  {
    id: 1,
    name: "Пекарня «Мамин хлеб»",
    description: "Свежий хлеб и выпечка каждый день из натуральных ингредиентов",
    logo: "https://p2.zoon.ru/preview/c4UfggC7ReKea6hM2zFPag/440x440x85/1/b/f/original_5c0678e1a24fd942f80635ec_5e25d1fe98a59.jpg",
    location: "Астана, пр. Абая, 8",
    rating: 4.8,
    category: "Пекарня",
    workingHours: "7:00 - 22:00",
    cuisine: "Выпечка",
    specialties: ["Хлеб", "Круассаны", "Пирожные"]
  },
  {
    id: 2,
    name: "Кафе «Plan B Burgers»",
    description: "«Plan B Burgers» — это классическая бургерная с уютной атмосферой, часто в стиле городского паб‑бара.",
    logo: "https://donnagentile.com/wp-content/uploads/2017/11/Portfolio_design_PlanB_logotype_o.jpg",
    location: "улица Акмешит, 13/2, Астана",
    rating: 4.7,
    category: "Кафе",
    workingHours: "8:00 - 21:00",
    cuisine: "Здоровая еда",
    specialties: ["Салаты", "Смузи", "Авокадо тосты"]
  },
  {
    id: 3,
    name: "Койфеня coffe24",
    description: "Coffee24 позиционируется как тёплое и дружелюбное место, где можно расслабиться с чашечкой кофе, поработать или встретиться с друзьями",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqCblLumvoPkQmH306Ak_by2v89d3-pXhLNA&s",
    location: "улица Алихан Бокейхан, 10, Астана",
    rating: 4.9,
    category: "Суши бар",
    workingHours: "11:00 - 23:00",
    cuisine: "Японская",
    specialties: ["Суши", "Роллы", "Сашими"]
  },
  {
    id: 4,
    name: "Койфеня alita coffee",
    description: "Alita Coffee — уютная кофейня с атмосферой тепла и уюта, где каждое утро начинается с ароматного кофе и вкусных завтраков.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSkdm_JnqS4Bp3PkIRyVn4kebrSjs7Bq_4UA&s",
    location: "Сагадат Нурмагамбетов, 27/1,",
    rating: 4.6,
    category: "Кондитерская",
    workingHours: "9:00 - 20:00",
    cuisine: "Десерты",
    specialties: ["Торты", "Капкейки", "Эклеры"]
  }
  
];

// Статистика для показа
export const partnersStats = {
  totalPartners: 10,
  averageRating: 4.7,
  coverage: "24/7",
  qualityControl: "100%"
};
