/**
 * ElectroStock — App Logic (offline SPA)
 * Działa w 100% lokalnie. Brak połączeń sieciowych.
 */

'use strict';

// ═══════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════
const S = {
  user:        null,
  view:        'all',
  filterCat:   null,
  filterPlat:  null,
  searchQuery: '',
  lang:        'en',
  theme:       'dark',
  authMode:    'login',  // 'login' | 'register'
};

// ═══════════════════════════════════════════
//  I18N
// ═══════════════════════════════════════════
const LANGS = {
  pl: {
    login:'Zaloguj się', register:'Zarejestruj się', username:'Użytkownik', password:'Hasło', appSub:'Lokalny magazyn części i przedmiotów', backup:'Kopia zapasowa', dangerZone:'Usuwanie danych',
    noAccount:'Nie masz konta?', hasAccount:'Masz już konto?', registerLink:'Zarejestruj się',
    loginLink:'Zaloguj się', allParts:'Wszystkie części', lowStock:'Niski stan',
    search:'Szukaj', settings:'Ustawienia', categories:'Kategorie', platforms:'Platformy',
    addPart:'Dodaj komponent', editPart:'Edytuj komponent', deletePart:'Usuń',
    name:'Nazwa', symbol:'Symbol/Nr katal.', category:'Kategoria', description:'Opis',
    quantity:'Stan', minQty:'Min. stan', maxQty:'Maks. stan', unit:'Jednostka',
    location:'Lokalizacja', locationHint:'np. A1-1, szuflada 3...', datasheet:'Datasheet URL', price:'Cena jedn.', notes:'Notatki',
    save:'Zapisz', cancel:'Anuluj', confirm:'Potwierdź', yes:'Tak', no:'Nie',
    delete:'Usuń', edit:'Edytuj', add:'Dodaj', close:'Zamknij',
    addCategory:'Dodaj kategorię', editCategory:'Edytuj kategorię',
    addPlatform:'Dodaj platformę', editPlatform:'Edytuj platforma',
    total:'Wszystkich', lowStockLbl:'Niski stan', totalQty:'Łącznie szt.',
    noResults:'Brak wyników', noPartsYet:'Brak komponentów',
    addFirst:'Dodaj swój pierwszy komponent klikając + w prawym górnym rogu.',
    adjust:'Koryguj stan', stockIn:'Przyjęcie', stockOut:'Wydanie',
    setStock:'Ustaw ilość', history:'Historia', logEmpty:'Brak historii',
    logout:'Wyloguj', manage:'Zarządzaj', all:'Wszystkie',
    exportOk:'Eksport gotowy', importOk:'Import zakończony', importErr:'Błąd importu',
    catManager:'Zarządzaj kategoriami', platManager:'Zarządzaj platformami',
    language:'Język', themeLabel:'Motyw', dark:'Ciemny', light:'Jasny',
    deleteConfirm:'Czy na pewno usunąć', cannotUndo:'Tej operacji nie można cofnąć.',
    saved:'Zapisano', deleted:'Usunięto', error:'Błąd',
    email:'E-mail (opcjonalnie)', icon:'Ikona', color:'Kolor',
    compatPlatforms:'Kompatybilne platformy', tags:'Tagi (oddzielone przecinkiem)',
    partHistory:'Historia komponentu', allHistory:'Historia magazynu', history:'Historia', history:'Historia',
    inventory:'Inwentarz', data:'Dane', userSettings:'Ustawienia konta',
    wrongPass:'Nieprawidłowe hasło', userExists:'Użytkownik już istnieje', notFound:'Nie znaleziono',
    fillFields:'Uzupełnij wymagane pola', minLen:'Minimum 4 znaki', noSearch:'Wpisz frazę do wyszukania',
    value:'Wartość magazynu', export:'Eksportuj', import:'Importuj', accountAbout:'O aplikacji', storage:'Przechowywanie', localData:'Pliki są przechowywane tylko lokalnie',
    deleteAllData:'Usunąć wszystkie dane', deleteStock:'Usunąć stany magazynowe', deleteStockSub:'Usuwa wszystkie komponenty z magazynu. Kategorie i platformy zostają.',
    deleteAllSub:'Usuwa komponenty, kategorie, platformy i historię.', exportJson:'Eksportuj JSON', importJson:'Importuj JSON', localOnlyNote:'Dane i pliki kopii zapasowej są przechowywane tylko lokalnie na tym urządzeniu.', version:'Wersja', noneCategory:'Brak', noPlatformsHint:'Brak platform — dodaj je w menu bocznym.', noCategories:'Brak kategorii', noPlatforms:'Brak platform', supportProject:'Wesprzyj projekt', supportProjectText:'Obejrzyj dobrowolną reklamę i otrzymaj 1 lokalny punkt wsparcia. Punkty nie mają wartości pieniężnej i nie odblokowują funkcji.', watchAd:'Obejrzyj reklamę', supportThanks:'Dziękuję za wsparcie — otrzymujesz 1 punkt ⚡', supportPoints:'Punkty wsparcia', adLoading:'Reklama jeszcze się ładuje. Spróbuj ponownie za chwilę.', adUnavailable:'Reklama jest teraz niedostępna. Spróbuj ponownie później.', privacySettings:'Ustawienia prywatności reklam', privacyError:'Nie udało się otworzyć ustawień prywatności.', stockProfile:'Profil magazynu', chooseProfile:'Wybierz profil magazynu', chooseProfileSub:'Ten wybór ustawi startowe kategorie, platformy i przykładowe elementy. Możesz też zacząć od zera.', profileElectronics:'Elektronik / prototypowanie', profileRepair:'Serwis komputerów i telefonów', profileWorkshop:'Warsztat / narzędzia', profileUniversal:'Uniwersalny magazyn', profileCreator:'Rękodzieło i produkcja', profileBooks:'Książki i dokumenty', profileClothes:'Ubrania i tekstylia', profileCollectibles:'Kolekcje i wartościowe przedmioty', profileBlank:'Zacznij od zera', profileBlankDesc:'Pusty magazyn bez startowych kategorii, platform i komponentów.', profileElectronicsDesc:'Komponenty elektroniczne, Arduino, ESP32 i prototypowanie.', profileRepairDesc:'Części do telefonów, laptopów, komputerów i tabletów.', profileWorkshopDesc:'Narzędzia, materiały, śruby, kleje i wyposażenie warsztatu.', profileUniversalDesc:'Ogólny magazyn do opakowań, materiałów, dokumentów i akcesoriów.', profileCreatorDesc:'Materiały, półprodukty, gotowe produkty, opakowania i narzędzia twórcy.', profileBooksDesc:'Książki, notesy, dokumenty, wydruki i materiały papierowe.', profileClothesDesc:'Ubrania, tekstylia, dodatki, rozmiary, kolory i stany magazynowe.', profileCollectiblesDesc:'Monety, karty, figurki, pamiątki i inne wartościowe przedmioty.', selectProfile:'Wybierz profil', next:'Dalej', previous:'Wstecz', stockProfile:'Profil magazynu', profileHint:'Wybór ustawia startowe kategorie, platformy i przykładowe części.', profileElectronics:'Elektronik / prototypowanie', profileRepair:'Serwis komputerów i telefonów', profileWorkshop:'Warsztat / narzędzia', profileUniversal:'Uniwersalny magazyn',
  },
  en: {
    login:'Log in', register:'Register', username:'Username', password:'Password', appSub:'Local inventory for parts and items', backup:'Backup', dangerZone:'Data deletion',
    noAccount:"Don't have an account?", hasAccount:'Have an account?', registerLink:'Register',
    loginLink:'Log in', allParts:'All parts', lowStock:'Low stock',
    search:'Search', settings:'Settings', categories:'Categories', platforms:'Platforms',
    addPart:'Add component', editPart:'Edit component', deletePart:'Delete',
    name:'Name', symbol:'Symbol/Part no.', category:'Category', description:'Description',
    quantity:'Quantity', minQty:'Min. qty', maxQty:'Max. qty', unit:'Unit',
    location:'Location', locationHint:'e.g. A1-1, drawer 3...', datasheet:'Datasheet URL', price:'Unit price', notes:'Notes',
    save:'Save', cancel:'Cancel', confirm:'Confirm', yes:'Yes', no:'No',
    delete:'Delete', edit:'Edit', add:'Add', close:'Close',
    addCategory:'Add category', editCategory:'Edit category',
    addPlatform:'Add platform', editPlatform:'Edit platform',
    total:'Total', lowStockLbl:'Low stock', totalQty:'Total units',
    noResults:'No results', noPartsYet:'No components yet',
    addFirst:'Add your first component by tapping + in the top right.',
    adjust:'Adjust stock', stockIn:'Stock in', stockOut:'Stock out',
    setStock:'Set quantity', history:'History', logEmpty:'No history',
    logout:'Log out', manage:'Manage', all:'All',
    exportOk:'Export ready', importOk:'Import complete', importErr:'Import error',
    catManager:'Manage categories', platManager:'Manage platforms',
    language:'Language', themeLabel:'Theme', dark:'Dark', light:'Light',
    deleteConfirm:'Really delete', cannotUndo:'This action cannot be undone.',
    saved:'Saved', deleted:'Deleted', error:'Error',
    email:'E-mail (optional)', icon:'Icon', color:'Color',
    compatPlatforms:'Compatible platforms', tags:'Tags (comma separated)',
    partHistory:'Part history', allHistory:'Warehouse history',
    inventory:'Inventory', data:'Data', userSettings:'Account settings',
    wrongPass:'Wrong password', userExists:'User already exists', notFound:'Not found',
    fillFields:'Fill in required fields', minLen:'Minimum 4 characters', noSearch:'Enter a search phrase',
    value:'Stock value', export:'Export', import:'Import', accountAbout:'About app', storage:'Storage', localData:'Files are stored locally only',
    deleteAllData:'Delete all data', deleteStock:'Delete inventory only', deleteStockSub:'Deletes all inventory components. Categories and platforms stay.',
    deleteAllSub:'Deletes components, categories, platforms and history.', exportJson:'Export JSON', importJson:'Import JSON', localOnlyNote:'Data and backup files are stored locally on this device only.', version:'Version', noneCategory:'None', noPlatformsHint:'No platforms — add them in the sidebar.', noCategories:'No categories', noPlatforms:'No platforms', supportProject:'Support the project', supportProjectText:'Watch an optional ad and receive 1 local support point. Points have no monetary value and do not unlock features.', watchAd:'Watch ad', supportThanks:'Thank you for your support — you received 1 point ⚡', supportPoints:'Support points', adLoading:'The ad is still loading. Try again in a moment.', adUnavailable:'The ad is currently unavailable. Try again later.', privacySettings:'Ad privacy settings', privacyError:'Privacy settings could not be opened.', stockProfile:'Inventory profile', chooseProfile:'Choose inventory profile', chooseProfileSub:'This sets starter categories, platforms and sample items. You can also start from scratch.', profileElectronics:'Electronics / prototyping', profileRepair:'Computer and phone repair', profileWorkshop:'Workshop / tools', profileUniversal:'Universal inventory', profileCreator:'Crafts and small production', profileBooks:'Books and documents', profileClothes:'Clothes and textiles', profileCollectibles:'Collectibles and valuables', profileBlank:'Start from scratch', profileBlankDesc:'Empty inventory with no starter categories, platforms or items.', profileElectronicsDesc:'Electronic components, Arduino, ESP32 and prototyping.', profileRepairDesc:'Parts for phones, laptops, PCs and tablets.', profileWorkshopDesc:'Tools, materials, screws, adhesives and workshop supplies.', profileUniversalDesc:'General inventory for packaging, materials, documents and accessories.', profileCreatorDesc:'Materials, semi-products, finished items, packaging and creator tools.', profileBooksDesc:'Books, notebooks, documents, prints and paper materials.', profileClothesDesc:'Clothes, textiles, accessories, sizes, colors and stock levels.', profileCollectiblesDesc:'Coins, cards, figures, memorabilia and other valuable items.', selectProfile:'Select profile', next:'Next', previous:'Previous', stockProfile:'Inventory profile', profileHint:'This sets starter categories, platforms and sample items.', profileElectronics:'Electronics / prototyping', profileRepair:'Computer and phone repair', profileWorkshop:'Workshop / tools', profileUniversal:'Universal inventory',
  },
  es: {
    login:'Iniciar sesión', register:'Registrarse', username:'Usuario', password:'Contraseña', appSub:'Inventario local de piezas y artículos', backup:'Copia de seguridad', dangerZone:'Eliminación de datos',
    noAccount:'¿No tienes cuenta?', hasAccount:'¿Ya tienes cuenta?', registerLink:'Registrarse',
    loginLink:'Iniciar sesión', allParts:'Todas las piezas', lowStock:'Stock bajo',
    search:'Buscar', settings:'Ajustes', categories:'Categorías', platforms:'Plataformas',
    addPart:'Añadir componente', editPart:'Editar componente', deletePart:'Eliminar',
    name:'Nombre', symbol:'Símbolo/Nº de pieza', category:'Categoría', description:'Descripción',
    quantity:'Cantidad', minQty:'Cantidad mín.', maxQty:'Cantidad máx.', unit:'Unidad',
    location:'Ubicación', locationHint:'p. ej. A1-1, cajón 3...', datasheet:'URL de datasheet', price:'Precio unit.', notes:'Notas',
    save:'Guardar', cancel:'Cancelar', confirm:'Confirmar', yes:'Sí', no:'No',
    delete:'Eliminar', edit:'Editar', add:'Añadir', close:'Cerrar',
    addCategory:'Añadir categoría', editCategory:'Editar categoría',
    addPlatform:'Añadir plataforma', editPlatform:'Editar plataforma',
    total:'Total', lowStockLbl:'Stock bajo', totalQty:'Unidades',
    noResults:'Sin resultados', noPartsYet:'Sin componentes',
    addFirst:'Añade tu primer componente tocando + arriba a la derecha.',
    adjust:'Ajustar stock', stockIn:'Entrada', stockOut:'Salida',
    setStock:'Establecer cantidad', history:'Historial', logEmpty:'Sin historial',
    logout:'Cerrar sesión', manage:'Gestionar', all:'Todas',
    export:'Exportar', import:'Importar', exportOk:'Exportación lista', importOk:'Importación completa', importErr:'Error de importación',
    catManager:'Gestionar categorías', platManager:'Gestionar plataformas',
    language:'Idioma', themeLabel:'Tema', dark:'Oscuro', light:'Claro',
    deleteConfirm:'¿Seguro que quieres eliminar', cannotUndo:'Esta operación no se puede deshacer.',
    saved:'Guardado', deleted:'Eliminado', error:'Error',
    icon:'Icono', color:'Color',
    compatPlatforms:'Plataformas compatibles', tags:'Etiquetas (separadas por comas)',
    partHistory:'Historial del componente', allHistory:'Historial del almacén',
    inventory:'Inventario', data:'Datos', userSettings:'Ajustes de cuenta',
    wrongPass:'Contraseña incorrecta', userExists:'El usuario ya existe', notFound:'No encontrado',
    fillFields:'Completa los campos requeridos', minLen:'Mínimo 4 caracteres', noSearch:'Introduce una frase de búsqueda',
    value:'Valor del stock', accountAbout:'Acerca de la aplicación', storage:'Almacenamiento', localData:'Los archivos se almacenan solo localmente',
    deleteAllData:'Eliminar todos los datos', deleteStock:'Borrar inventario', deleteStockSub:'Elimina todos los componentes del inventario. Las categorías y plataformas se quedan.',
    deleteAllSub:'Elimina componentes, categorías, plataformas e historial.', exportJson:'Exportar JSON', importJson:'Importar JSON', localOnlyNote:'Los datos y copias de seguridad se guardan solo localmente en este dispositivo.', version:'Versión', noneCategory:'Ninguna', noPlatformsHint:'No hay plataformas — añádelas en el menú lateral.', noCategories:'No hay categorías', noPlatforms:'No hay plataformas', supportProject:'Apoya el proyecto', supportProjectText:'Mira un anuncio opcional y recibe 1 punto de apoyo local. Los puntos no tienen valor monetario ni desbloquean funciones.', watchAd:'Ver anuncio', supportThanks:'Gracias por tu apoyo — recibiste 1 punto ⚡', supportPoints:'Puntos de apoyo', adLoading:'El anuncio todavía se está cargando. Inténtalo de nuevo en un momento.', adUnavailable:'El anuncio no está disponible ahora. Inténtalo más tarde.', privacySettings:'Privacidad de los anuncios', privacyError:'No se pudieron abrir los ajustes de privacidad.', stockProfile:'Perfil del inventario', chooseProfile:'Elige perfil del inventario', chooseProfileSub:'Configura categorías, plataformas y artículos iniciales. También puedes empezar desde cero.', profileElectronics:'Electrónica / prototipado', profileRepair:'Reparación de ordenadores y teléfonos', profileWorkshop:'Taller / herramientas', profileUniversal:'Inventario universal', profileCreator:'Artesanía y pequeña producción', profileBooks:'Libros y documentos', profileClothes:'Ropa y textiles', profileCollectibles:'Colecciones y objetos valiosos', profileBlank:'Empezar desde cero', profileBlankDesc:'Inventario vacío sin categorías, plataformas ni artículos iniciales.', profileElectronicsDesc:'Componentes electrónicos, Arduino, ESP32 y prototipado.', profileRepairDesc:'Piezas para teléfonos, portátiles, PC y tablets.', profileWorkshopDesc:'Herramientas, materiales, tornillos, adhesivos y taller.', profileUniversalDesc:'Inventario general para embalajes, materiales, documentos y accesorios.', profileCreatorDesc:'Materiales, semiproductos, productos terminados, embalajes y herramientas.', profileBooksDesc:'Libros, cuadernos, documentos, impresiones y materiales de papel.', profileClothesDesc:'Ropa, textiles, accesorios, tallas, colores y existencias.', profileCollectiblesDesc:'Monedas, cartas, figuras, recuerdos y otros objetos valiosos.', selectProfile:'Elegir perfil', next:'Siguiente', previous:'Anterior', stockProfile:'Perfil del inventario', profileHint:'Configura categorías, plataformas y artículos iniciales.', profileElectronics:'Electrónica / prototipado', profileRepair:'Reparación de ordenadores y teléfonos', profileWorkshop:'Taller / herramientas', profileUniversal:'Inventario universal',
  },
};
const t = key => (LANGS[S.lang]||LANGS.pl)[key] || key;
let privacyOptionsRequired = false;

function getSupportPoints() {
  const value = Number.parseInt(localStorage.getItem('es_support_points') || '0', 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function supportPointIcons(points) {
  const visible = Math.min(points, 5);
  const icons = Array.from({ length: visible }, () => '<span class="support-point-icon">⚡</span>').join('');
  const empty = points === 0 ? '<span class="support-points-empty">—</span>' : '';
  const more = points > 5 ? `<span class="support-points-more">+${points - 5}</span>` : '';
  return icons + empty + more;
}

const DEFAULT_CATEGORY_NAMES = {
  'Rezystory': { en:'Resistors', es:'Resistencias' },
  'Kondensatory': { en:'Capacitors', es:'Condensadores' },
  'Tranzystory': { en:'Transistors', es:'Transistores' },
  'Diody': { en:'Diodes', es:'Diodos' },
  'Układy scalone': { en:'Integrated circuits', es:'Circuitos integrados' },
  'Złącza': { en:'Connectors', es:'Conectores' },
  'Cewki i dławiki': { en:'Coils and chokes', es:'Bobinas y choques' },
  'Indukcyjności': { en:'Coils and chokes', es:'Bobinas y choques' },
  'Mikrokontrolery': { en:'Microcontrollers', es:'Microcontroladores' },
  'Zasilanie': { en:'Power', es:'Alimentación' },
  'Inne': { en:'Other', es:'Otros' },
  'Płyty główne': { en:'Motherboards', es:'Placas base' },
  'Ekrany i monitory': { en:'Screens and displays', es:'Pantallas y monitores' },
  'Obudowy': { en:'Cases and housings', es:'Carcasas' },
  'Baterie': { en:'Batteries', es:'Baterías' },
  'Taśmy flex': { en:'Flex cables', es:'Cables flex' },
  'Głośniki': { en:'Speakers', es:'Altavoces' },
  'Kamery': { en:'Cameras', es:'Cámaras' },
  'Klawiatury': { en:'Keyboards', es:'Teclados' },
  'Dyski': { en:'Drives', es:'Discos' },
  'Pamięć RAM': { en:'RAM memory', es:'Memoria RAM' },
  'Narzędzia ręczne': { en:'Hand tools', es:'Herramientas manuales' },
  'Narzędzia elektryczne': { en:'Power tools', es:'Herramientas eléctricas' },
  'Materiały': { en:'Materials', es:'Materiales' },
  'Śruby i mocowania': { en:'Screws and fasteners', es:'Tornillos y fijaciones' },
  'Kleje i chemia': { en:'Adhesives and chemicals', es:'Adhesivos y químicos' },
  'Opakowania': { en:'Packaging', es:'Embalajes' },
  'Dokumenty': { en:'Documents', es:'Documentos' },
  'Akcesoria': { en:'Accessories', es:'Accesorios' },
  'Sejf': { en:'Safe', es:'Caja fuerte' },
  'Do sprzedaży': { en:'For sale', es:'Para vender' },
  'Kolekcja główna': { en:'Main collection', es:'Colección principal' },
  'Sprzedaż': { en:'Sales', es:'Ventas' },
  'Dom': { en:'Home', es:'Casa' },
  'Prototypy': { en:'Prototypes', es:'Prototipos' },
  'Wysyłka': { en:'Shipping', es:'Envíos' },
  'Produkcja': { en:'Production', es:'Producción' },
  'Magazyn': { en:'Storage', es:'Almacén' },
  'Narzędzia': { en:'Tools', es:'Herramientas' },
  'Półprodukty': { en:'Semi-products', es:'Semiproductos' },
  'Gotowe produkty': { en:'Finished products', es:'Productos terminados' },
  'Papier i wydruki': { en:'Paper and prints', es:'Papel e impresiones' },
  'Tkaniny': { en:'Fabrics', es:'Telas' },
  'Przypinki': { en:'Pins', es:'Chapas' },
  'Książki': { en:'Books', es:'Libros' },
  'Notesy': { en:'Notebooks', es:'Cuadernos' },
  'Wydruki': { en:'Prints', es:'Impresiones' },
  'Archiwum': { en:'Archive', es:'Archivo' },
  'Koszulki': { en:'T-shirts', es:'Camisetas' },
  'Bluzy': { en:'Hoodies', es:'Sudaderas' },
  'Spodnie': { en:'Pants', es:'Pantalones' },
  'Dodatki': { en:'Accessories', es:'Accesorios' },
  'Monety': { en:'Coins', es:'Monedas' },
  'Karty kolekcjonerskie': { en:'Trading cards', es:'Cartas coleccionables' },
  'Figurki': { en:'Figures', es:'Figuras' },
  'Pamiątki': { en:'Memorabilia', es:'Recuerdos' },
};
const DEFAULT_PART_NAMES = {
  'Rezystor 10kΩ 1/4W': { en:'10kΩ resistor 1/4W', es:'Resistencia 10kΩ 1/4W' },
  'Rezystor 1kΩ 1/4W': { en:'1kΩ resistor 1/4W', es:'Resistencia 1kΩ 1/4W' },
  'Kondensator 100nF ceramiczny': { en:'100nF ceramic capacitor', es:'Condensador cerámico 100nF' },
  'LED czerwona 5mm': { en:'Red LED 5mm', es:'LED rojo 5mm' },
  'ATmega328P': { en:'ATmega328P', es:'ATmega328P' },
  'Płyta główna laptopa': { en:'Laptop motherboard', es:'Placa base de portátil' },
  'Ekran telefonu': { en:'Phone screen', es:'Pantalla de teléfono' },
  'Bateria telefonu': { en:'Phone battery', es:'Batería de teléfono' },
  'Dysk SSD 256GB': { en:'256GB SSD', es:'SSD 256GB' },
  'Śrubokręt precyzyjny': { en:'Precision screwdriver', es:'Destornillador de precisión' },
  'Klej montażowy': { en:'Mounting adhesive', es:'Adhesivo de montaje' },
  'Śruby M3': { en:'M3 screws', es:'Tornillos M3' },
  'Pudełko magazynowe': { en:'Storage box', es:'Caja de almacenamiento' },
  'Koperta bąbelkowa': { en:'Bubble mailer', es:'Sobre acolchado' },
  'Etykiety samoprzylepne': { en:'Self-adhesive labels', es:'Etiquetas adhesivas' },
  'Papier foto A4': { en:'A4 photo paper', es:'Papel fotográfico A4' },
  'Organza bag': { en:'Organza bag', es:'Bolsa de organza' },
  'Notes A5': { en:'A5 notebook', es:'Cuaderno A5' },
  'Książka magazynowa': { en:'Inventory book', es:'Libro de inventario' },
  'Koszulka czarna M': { en:'Black T-shirt M', es:'Camiseta negra M' },
  'Bluza grafitowa L': { en:'Graphite hoodie L', es:'Sudadera grafito L' },
  'Moneta srebrna 1 oz': { en:'1 oz silver coin', es:'Moneda de plata 1 oz' },
  'Karta kolekcjonerska': { en:'Trading card', es:'Carta coleccionable' },
};
function trCategoryName(name) { return (DEFAULT_CATEGORY_NAMES[name] && DEFAULT_CATEGORY_NAMES[name][S.lang]) || name || ''; }
function trPartName(name) { return (DEFAULT_PART_NAMES[name] && DEFAULT_PART_NAMES[name][S.lang]) || name || ''; }

const DEFAULT_PLATFORM_NAMES = {
  'Arduino': { en:'Arduino', es:'Arduino' },
  'Raspberry Pi': { en:'Raspberry Pi', es:'Raspberry Pi' },
  'ESP32': { en:'ESP32', es:'ESP32' },
  'STM32': { en:'STM32', es:'STM32' },
  'Telefony': { en:'Phones', es:'Teléfonos' },
  'Laptopy': { en:'Laptops', es:'Portátiles' },
  'Komputery PC': { en:'Desktop PCs', es:'Ordenadores de sobremesa' },
  'Tablety': { en:'Tablets', es:'Tablets' },
  'Warsztat': { en:'Workshop', es:'Taller' },
  'Dom': { en:'Home', es:'Casa' },
  'Produkcja': { en:'Production', es:'Producción' },
  'Naprawy': { en:'Repairs', es:'Reparaciones' },
  'Magazyn główny': { en:'Main storage', es:'Almacén principal' },
  'Biuro': { en:'Office', es:'Oficina' },
  'Wysyłka': { en:'Shipping', es:'Envíos' },
  'Magazyn': { en:'Storage', es:'Almacén' },
  'Prototypy': { en:'Prototypes', es:'Prototipos' },
  'Archiwum': { en:'Archive', es:'Archivo' },
  'Sprzedaż': { en:'Sales', es:'Ventas' },
  'S': { en:'S', es:'S' },
  'M': { en:'M', es:'M' },
  'L': { en:'L', es:'L' },
  'XL': { en:'XL', es:'XL' },
  'Kolekcja główna': { en:'Main collection', es:'Colección principal' },
  'Do sprzedaży': { en:'For sale', es:'Para vender' },
  'Sejf': { en:'Safe', es:'Caja fuerte' },
};
function trPlatformName(name) { return (DEFAULT_PLATFORM_NAMES[name] && DEFAULT_PLATFORM_NAMES[name][S.lang]) || name || ''; }

function trUnit(unit) { if (unit === 'szt.') return S.lang === 'en' ? 'pcs' : (S.lang === 'es' ? 'uds.' : 'szt.'); return unit || ''; }

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', async () => {
  await openDB();

  const savedLang = localStorage.getItem('es_lang');
  if (['pl','en','es'].includes(savedLang)) S.lang = savedLang;

  // Restore session
  const saved = sessionStorage.getItem('es_user');
  if (saved) {
    const u = await getUser(saved);
    if (u) {
      S.user = u;
      S.lang  = u.settings?.lang  || 'en';
      S.theme = u.settings?.theme || 'dark';
    }
  }

  applyTheme();
  const authLang = document.getElementById('authLang');
  if (authLang) authLang.value = S.lang;

  // Hide splash after animation
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    if (S.user) {
      if (needsProfileSetup()) showProfileSetup();
      else showApp();
    } else {
      showLogin();
    }
  }, 1900);
});

// ═══════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════
function applyTheme() {
  document.body.className = S.theme === 'light' ? 'light' : '';
}


// ═══════════════════════════════════════════
//  PROFILE SETUP
// ═══════════════════════════════════════════
const PROFILE_ORDER = ['electronics','repair','workshop','creator','books','clothes','collectibles','universal','blank'];
const PROFILE_VISUALS = {
  electronics: { icon:'⚡', preview:'💡 🟫 🧩 🔋', color:'#3FB950' },
  repair:      { icon:'📱', preview:'🧩 🖥️ 🔋 💾', color:'#388BFD' },
  workshop:    { icon:'🛠️', preview:'🪛 🔩 🧪 📦', color:'#D29922' },
  creator:     { icon:'🎨', preview:'🎨 🖨️ 🧵 📦', color:'#EC4899' },
  books:       { icon:'📚', preview:'📘 📗 📙 🏷️', color:'#14B8A6' },
  clothes:     { icon:'👕', preview:'👕 👖 🧦 🧢', color:'#06B6D4' },
  collectibles:{ icon:'⭐', preview:'🪙 🎴 🧸 🏷️', color:'#FACC15' },
  universal:   { icon:'📦', preview:'🏷️ 📄 🧰 ✉️', color:'#A855F7' },
  blank:       { icon:'✨', preview:'＋ ＋ ＋ ＋', color:'#8B949E' },
};

function getProfileLabels() {
  return {
    electronics: t('profileElectronics'),
    repair:      t('profileRepair'),
    workshop:    t('profileWorkshop'),
    creator:     t('profileCreator'),
    books:       t('profileBooks'),
    clothes:     t('profileClothes'),
    collectibles:t('profileCollectibles'),
    universal:   t('profileUniversal'),
    blank:       t('profileBlank'),
  };
}

function getProfileDescriptions() {
  return {
    electronics: t('profileElectronicsDesc'),
    repair:      t('profileRepairDesc'),
    workshop:    t('profileWorkshopDesc'),
    creator:     t('profileCreatorDesc'),
    books:       t('profileBooksDesc'),
    clothes:     t('profileClothesDesc'),
    collectibles:t('profileCollectiblesDesc'),
    universal:   t('profileUniversalDesc'),
    blank:       t('profileBlankDesc'),
  };
}

function needsProfileSetup() {
  return !!S.user && !S.user.settings?.stockProfile;
}

function showProfileSetup(index=0) {
  S.profileIndex = Math.max(0, Math.min(PROFILE_ORDER.length - 1, index));
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('appView').classList.remove('hidden');
  document.getElementById('sidebarUsername').textContent = S.user.username;
  closeSidebar();

  const key = PROFILE_ORDER[S.profileIndex];
  const labels = getProfileLabels();
  const desc = getProfileDescriptions();
  const visual = PROFILE_VISUALS[key];

  const dots = PROFILE_ORDER.map((p,i)=>`<button class="profile-dot ${i===S.profileIndex?'active':''}" onclick="showProfileSetup(${i})" aria-label="${esc(labels[p])}"></button>`).join('');

  document.getElementById('topbarTitle').textContent = t('chooseProfile');
  document.getElementById('mainContent').innerHTML = `
    <div class="profile-setup">
      <div class="profile-head">
        <div class="profile-kicker">${t('stockProfile')}</div>
        <div class="profile-title">${t('chooseProfile')}</div>
        <div class="profile-sub">${t('chooseProfileSub')}</div>
      </div>

      <div class="profile-carousel">
        <button class="profile-arrow" onclick="showProfileSetup((S.profileIndex + PROFILE_ORDER.length - 1) % PROFILE_ORDER.length)">‹</button>

        <div class="profile-card-big" style="--profile-color:${visual.color}">
          <div class="profile-card-glow"></div>
          <div class="profile-card-icon">${visual.icon}</div>
          <div class="profile-card-preview">${visual.preview}</div>
          <div class="profile-card-name">${esc(labels[key])}</div>
          <div class="profile-card-desc">${esc(desc[key])}</div>
        </div>

        <button class="profile-arrow" onclick="showProfileSetup((S.profileIndex + 1) % PROFILE_ORDER.length)">›</button>
      </div>

      <div class="profile-dots">${dots}</div>

      <button class="btn btn-primary w100 profile-select-btn" onclick="selectProfile('${key}')">${t('selectProfile')}</button>
    </div>
  `;
}

async function selectProfile(profile) {
  profile = PROFILE_ORDER.includes(profile) ? profile : 'electronics';
  await updateUserSettings(S.user.username, { stockProfile: profile, profileSetupDone: true });
  if (profile !== 'blank') {
    await seedDefaults(S.user.username, profile);
  }
  S.user = await getUser(S.user.username);
  await renderSidebar();
  navigate('all');
}


// ═══════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════
function showLogin() {
  document.getElementById('appView').classList.add('hidden');
  document.getElementById('loginView').classList.remove('hidden');
  setAuthMode(S.authMode);
}

function toggleAuthMode() {
  S.authMode = S.authMode === 'login' ? 'register' : 'login';
  setAuthMode(S.authMode);
}

function setAuthLang(lang) {
  S.lang = ['pl','en','es'].includes(lang) ? lang : 'en';
  localStorage.setItem('es_lang', S.lang);
  const authLang = document.getElementById('authLang');
  if (authLang) authLang.value = S.lang;
  setAuthMode(S.authMode);
}




function setAuthMode(mode) {
  S.authMode = mode;
  const isLogin = mode === 'login';
  document.getElementById('authBtn').textContent = isLogin ? t('login') : t('register');
  document.getElementById('loginSwitchTxt').textContent  = isLogin ? t('noAccount') : t('hasAccount');
  document.getElementById('loginSwitchLink').textContent = isLogin ? t('registerLink') : t('loginLink');
  const userLabel = document.querySelector('label[for="loginUser"]');
  const passLabel = document.querySelector('label[for="loginPass"]');
  if (userLabel) userLabel.textContent = t('username');
  if (passLabel) passLabel.textContent = t('password');
  const note = document.getElementById('localOnlyNote');
  if (note) note.textContent = t('localOnlyNote');
  const sub = document.getElementById('loginSub');
  if (sub) sub.textContent = t('appSub');
  const authLang = document.getElementById('authLang');
  if (authLang) authLang.value = S.lang;
  const userInput = document.getElementById('loginUser');
  const passInput = document.getElementById('loginPass');
  if (userInput) userInput.placeholder = t('username').toLowerCase();
  if (passInput) passInput.placeholder = '••••••';
  hideError();
}

async function doAuth() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;
  hideError();

  if (!username || !password) { showError(t('fillFields')); return; }
  if (username.length < 3)    { showError(t('minLen'));     return; }

  if (S.authMode === 'login') {
    const u = await getUser(username);
    if (!u) { showError(t('notFound')); return; }
    if (u.passwordHash !== hashPassword(password)) { showError(t('wrongPass')); return; }
    S.user = u;
  } else {
    const existing = await getUser(username);
    if (existing) { showError(t('userExists')); return; }
    await createUser(username, hashPassword(password));
    await updateUserSettings(username, { lang: S.lang, theme: S.theme });
    S.user = await getUser(username);
  }

  S.lang  = S.user.settings?.lang  || 'en';
  S.theme = S.user.settings?.theme || 'dark';
  applyTheme();
  sessionStorage.setItem('es_user', username);
  if (needsProfileSetup()) showProfileSetup();
  else showApp();
}

function doLogout() {
  sessionStorage.removeItem('es_user');
  S.user = null; S.filterCat = null; S.filterPlat = null; S.searchQuery = '';
  closeSidebar();
  document.getElementById('appView').classList.add('hidden');
  showLogin();
}

function showError(msg) {
  const el = document.getElementById('loginError');
  el.textContent = msg; el.classList.remove('hidden');
}
function hideError() { document.getElementById('loginError').classList.add('hidden'); }

// ═══════════════════════════════════════════
//  APP
// ═══════════════════════════════════════════
async function showApp() {
  if (needsProfileSetup()) {
    showProfileSetup();
    return;
  }
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('appView').classList.remove('hidden');
  document.getElementById('sidebarUsername').textContent = S.user.username;
  await applyCatalogPatch();
  await renderSidebar();
  navigate('all');
}

async function applyCatalogPatch() {
  if (!S.user) return;

  const profile = S.user.settings?.stockProfile || 'electronics';

  // Existing users from older versions get a safe, non-destructive platform patch.
  if (S.user.settings?.platformFix20260518 === true) return;

  if (!S.user.settings?.stockProfile) {
    await updateUserSettings(S.user.username, { stockProfile: profile });
  }

  if (typeof ensureProfileCatalog === 'function') {
    await ensureProfileCatalog(S.user.username, profile);
  }

  await updateUserSettings(S.user.username, { platformFix20260518: true });
  S.user = await getUser(S.user.username);
}


// ═══════════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════════
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  const open = sb.classList.contains('open');
  sb.classList.toggle('open', !open);
  ov.classList.toggle('hidden', open);
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.add('hidden');
}

async function renderSidebar() {
  document.getElementById('sidebarRole').textContent = S.lang === 'en' ? 'user' : (S.lang === 'es' ? 'usuario' : 'użytkownik');
  document.querySelectorAll('.sidebar-section-title')[0].textContent = String(t('inventory')).toUpperCase();
  document.querySelector('#navAll span:last-child').textContent = t('allParts');
  document.querySelector('#navLow span:last-child').textContent = t('lowStock');
  document.querySelectorAll('.sidebar-section-title')[1].textContent = String(t('categories')).toUpperCase();
  document.querySelectorAll('.sidebar-section-title')[2].textContent = String(t('platforms')).toUpperCase();
  document.querySelectorAll('.sidebar-section-title')[3].textContent = String(t('data')).toUpperCase();
  await renderCategoryList();
  await renderPlatformList();
  const manageLinks = document.querySelectorAll('.sidebar-link-muted span:last-child');
  if (manageLinks[0]) manageLinks[0].textContent = t('catManager');
  if (manageLinks[1]) manageLinks[1].textContent = t('platManager');
  const navAllPlat = document.querySelector('#navAllPlat span:last-child');
  if (navAllPlat) navAllPlat.textContent = S.lang === 'pl' ? 'Wszystkie platformy' : (S.lang === 'en' ? 'All platforms' : 'Todas las plataformas');
  const sections = document.querySelectorAll('.sidebar-section');
  const dataSection = sections[3];
  const dataLinks = dataSection ? dataSection.querySelectorAll('.sidebar-link span:last-child') : [];
  if (dataLinks[0]) dataLinks[0].textContent = t('settings');
}

async function renderCategoryList() {
  const cats = await getCategories(S.user.username);
  const el = document.getElementById('categoryList');
  el.innerHTML = '';
  // "All" link
  const allLink = makeEl('a', 'sidebar-link' + (S.filterCat === null && S.filterPlat === null && S.view === 'all' ? ' active' : ''));
  allLink.innerHTML = `<span class="sidebar-icon">📋</span><span>${t('allParts')}</span>`;
  allLink.onclick = () => navigate('all');
  el.appendChild(allLink);

  cats.sort((a,b)=>a.name.localeCompare(b.name));
  for (const c of cats) {
    const a = makeEl('a', 'sidebar-link' + (S.filterCat === c.id ? ' active' : ''));
    a.innerHTML = `<span class="sidebar-icon">${esc(c.icon)}</span><span class="ellipsis">${esc(trCategoryName(c.name))}</span>`;
    a.onclick = () => filterByCategory(c.id);
    el.appendChild(a);
  }
}

async function renderPlatformList() {
  const allPlat = document.getElementById('navAllPlat');
  if (allPlat) allPlat.classList.toggle('active', S.filterPlat === null && S.filterCat === null && S.view === 'all');
  const plats = await getPlatforms(S.user.username);
  const el = document.getElementById('platformList');
  el.innerHTML = '';
  plats.sort((a,b)=>a.name.localeCompare(b.name));
  for (const p of plats) {
    const a = makeEl('a', 'sidebar-link' + (S.filterPlat === p.id ? ' active' : ''));
    a.innerHTML = `<span class="sidebar-icon" style="color:${p.color}">▣</span><span class="ellipsis">${esc(trPlatformName(p.name))}</span>`;
    a.onclick = () => filterByPlatform(p.id);
    el.appendChild(a);
  }
}

function filterByCategory(id) {
  S.filterCat = id; S.filterPlat = null; S.view = 'all';
  closeSidebar();
  renderSidebar();
  renderPartsList();
}
function filterByPlatform(id) {
  S.filterPlat = id; S.filterCat = null; S.view = 'all';
  closeSidebar();
  renderSidebar();
  renderPartsList();
}

// ═══════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════
function navigate(view) {
  S.view = view;
  if (view === 'all') {
    S.filterCat = null; S.filterPlat = null; S.searchQuery = '';
  } else if (view !== 'low') {
    S.filterCat = null; S.filterPlat = null;
  }
  closeSidebar();
  const titles = { all: 'ElectroStock', low: t('lowStock'), search: t('search'), settings: t('settings') };
  document.getElementById('topbarTitle').textContent = titles[view] || 'ElectroStock';
  renderSidebar();

  const mc = document.getElementById('mainContent');
  if (view === 'settings') { renderSettings(mc); return; }
  if (view === 'search')   { renderSearch(mc);   return; }
  renderPartsList(mc);
}

// ═══════════════════════════════════════════
//  PARTS LIST
// ═══════════════════════════════════════════
async function renderPartsList(container) {
  const mc = container || document.getElementById('mainContent');
  mc.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div></div>';

  const filters = {};
  if (S.filterCat)   filters.category = await getCategoryName(S.filterCat);
  if (S.filterPlat)  filters.platform = await getPlatformName(S.filterPlat);
  if (S.view === 'low') filters.lowStock = true;
  if (S.searchQuery) filters.q = S.searchQuery;

  const parts = await getParts(S.user.username, filters);
  const stats = getStatsFromParts(parts);

  mc.innerHTML = '';

  // Stats bar
  const sb = makeEl('div', 'stats-bar');
  sb.innerHTML = `
    <div class="stat-card"><div class="stat-val">${stats.total}</div><div class="stat-lbl">${t('total')}</div></div>
    <div class="stat-card"><div class="stat-val" style="color:var(--danger)">${stats.lowStock}</div><div class="stat-lbl">${t('lowStockLbl')}</div></div>
    <div class="stat-card"><div class="stat-val">${stats.totalQty}</div><div class="stat-lbl">${t('totalQty')}</div></div>
  `;
  mc.appendChild(sb);

  // Active filters display
  if (S.filterCat || S.filterPlat) {
    const af = makeEl('div', 'active-filters');
    if (S.filterCat) {
      const name = await getCategoryName(S.filterCat);
      af.innerHTML += `<span class="filter-chip">📦 ${esc(trCategoryName(name))} <button onclick="filterByCategory(null)">✕</button></span>`;
    }
    if (S.filterPlat) {
      const name = await getPlatformName(S.filterPlat);
      af.innerHTML += `<span class="filter-chip">▣ ${esc(name)} <button onclick="filterByPlatform(null)">✕</button></span>`;
    }
    mc.appendChild(af);
  }

  // Parts grid
  if (parts.length === 0) {
    const es = makeEl('div', 'empty-state');
    es.innerHTML = `<div class="empty-icon">${S.view==='low'?'✅':'📦'}</div>
      <div class="empty-title">${S.filterCat||S.filterPlat||S.searchQuery ? t('noResults') : t('noPartsYet')}</div>
      <div class="empty-sub">${!S.filterCat&&!S.filterPlat&&!S.searchQuery ? t('addFirst') : ''}</div>`;
    mc.appendChild(es);
    return;
  }

  const cats = Object.fromEntries((await getCategories(S.user.username)).map(c=>[c.name,c]));
  const plats = Object.fromEntries((await getPlatforms(S.user.username)).map(p=>[p.id,p]));

  const grid = makeEl('div', 'parts-grid');
  for (const p of parts) {
    const stockClass = (p.minQty>0 && p.quantity<=0) ? 'low'
                     : (p.minQty>0 && p.quantity<=p.minQty) ? 'warn' : '';
    const catIcon = cats[p.category]?.icon || '📦';
    const platTags = (p.platforms||[]).map(pid => {
      const pl = plats[pid];
      return pl ? `<span class="tag platform" style="border-color:${pl.color}40;color:${pl.color}">${esc(pl.name)}</span>` : '';
    }).join('');

    const card = makeEl('div', 'part-card');
    card.innerHTML = `
      <div class="part-card-top">
        <div class="part-card-icon">${esc(p.icon||catIcon)}</div>
        <div class="part-card-info">
          <div class="part-card-name">${esc(trPartName(p.name))}</div>
          <div class="part-card-meta">${esc(p.symbol||'')}${p.symbol&&p.category?' · ':''}${esc(trCategoryName(p.category||''))}${p.location?' · 📍'+esc(p.location):''}</div>
        </div>
        <div class="part-card-right">
          <div class="part-card-stock ${stockClass}">${p.quantity}</div>
          <div class="part-card-unit">${esc(trUnit(p.unit||'szt.'))}</div>
        </div>
      </div>
      ${platTags ? `<div class="part-card-tags">${platTags}</div>` : ''}
    `;
    card.onclick = () => openPartDetail(p.id);
    grid.appendChild(card);
  }
  mc.appendChild(grid);
}

async function getCategoryName(id) {
  if (!id) return '';
  const cats = await getCategories(S.user.username);
  return cats.find(c=>c.id===id)?.name || '';
}

async function getCategoryNamesWithChildren(id) {
  if (!id) return [];
  const cats = await getCategories(S.user.username);
  const selected = cats.find(c => c.id === id);
  if (!selected) return [];
  const names = [selected.name];
  const addChildren = parentId => {
    cats.filter(c => c.parentId === parentId).forEach(child => {
      names.push(child.name);
      addChildren(child.id);
    });
  };
  addChildren(id);
  return names;
}

async function getPlatformName(idOrName) {
  if (!idOrName) return '';
  const plats = await getPlatforms(S.user.username);
  return plats.find(p=>p.id===idOrName || p.name===idOrName)?.name || String(idOrName);
}

function getStatsFromParts(parts) {
  const list = Array.isArray(parts) ? parts : [];
  return {
    total: list.length,
    lowStock: list.filter(p => (Number(p.minQty)||0) > 0 && Number(p.quantity) <= Number(p.minQty)).length,
    totalQty: list.reduce((sum, p) => sum + (Number(p.quantity)||0), 0),
  };
}

// ═══════════════════════════════════════════
//  PART DETAIL MODAL
// ═══════════════════════════════════════════
async function openPartDetail(id) {
  const [part, cats, plats] = await Promise.all([
    getPartById(id),
    getCategories(S.user.username),
    getPlatforms(S.user.username),
  ]);
  if (!part) return;

  const stockClass = (part.minQty>0 && part.quantity<=0) ? ' low' : '';
  const platMap = Object.fromEntries(plats.map(p=>[p.id,p]));
  const platTags = (part.platforms||[]).map(pid=>platMap[pid]?.name||'').filter(Boolean).join(', ');

  const body = `
    <div class="detail-section">
      <div style="text-align:center; margin-bottom: 16px;">
        <div style="font-size:48px;">${esc(part.icon||'🔩')}</div>
        <div class="detail-stock${stockClass}">${part.quantity} <span style="font-size:14px;font-weight:400;color:var(--sub)">${esc(trUnit(part.unit||'szt.'))}</span></div>
      </div>
      <div class="stock-controls">
        <button class="stock-btn" onclick="quickAdjust(${id}, -10)">−10</button>
        <button class="stock-btn" onclick="quickAdjust(${id}, -1)">−1</button>
        <input class="input stock-input" type="number" id="qtyInput" value="${part.quantity}" min="0">
        <button class="stock-btn" onclick="quickAdjust(${id}, 1)">+1</button>
        <button class="stock-btn" onclick="quickAdjust(${id}, 10)">+10</button>
      </div>
      <button class="btn btn-secondary w100 mt8" onclick="applyQtyInput(${id})">${t('setStock')}</button>
    </div>

    <div class="section-divider">${t('name')}</div>
    <div class="detail-row"><div class="detail-value bold">${esc(trPartName(part.name))}</div></div>
    ${part.symbol ? `<div class="detail-row"><div class="detail-label">${t('symbol')}</div><div class="detail-value">${esc(part.symbol)}</div></div>` : ''}
    ${part.category ? `<div class="detail-row"><div class="detail-label">${t('category')}</div><div class="detail-value">${esc(trCategoryName(part.category))}</div></div>` : ''}
    ${part.location ? `<div class="detail-row"><div class="detail-label">📍 ${t('location')}</div><div class="detail-value">${esc(part.location)}</div></div>` : ''}
    ${part.description ? `<div class="detail-row"><div class="detail-label">${t('description')}</div><div class="detail-value">${esc(part.description)}</div></div>` : ''}
    ${platTags ? `<div class="detail-row"><div class="detail-label">${t('platforms')}</div><div class="detail-value">${esc(platTags)}</div></div>` : ''}
    ${part.minQty>0 ? `<div class="detail-row"><div class="detail-label">Min</div><div class="detail-value">${part.minQty} ${esc(trUnit(part.unit||'szt.'))}</div></div>` : ''}
    ${part.price>0  ? `<div class="detail-row"><div class="detail-label">${t('price')}</div><div class="detail-value">${part.price} ${esc(part.currency||'PLN')}</div></div>` : ''}
    ${part.notes    ? `<div class="detail-row"><div class="detail-label">${t('notes')}</div><div class="detail-value">${esc(part.notes)}</div></div>` : ''}
    ${part.datasheet? `<div class="detail-row"><div class="detail-label">Datasheet</div><div class="detail-value"><a href="${esc(part.datasheet)}" target="_blank" style="color:var(--info)">↗ otwórz</a></div></div>` : ''}
  `;

  const footer = `
    <button class="btn btn-secondary" onclick="openHistory(${id})">🕘 ${t('history')}</button>
    <button class="btn btn-secondary" onclick="openEditPart(${id})">✏️ ${t('edit')}</button>
    <button class="btn btn-danger"    onclick="confirmDeletePart(${id})">🗑</button>
  `;

  showModal(esc(part.name), body, footer);
}

async function quickAdjust(id, delta) {
  const newQty = await adjustQty(id, delta);
  document.getElementById('qtyInput').value = newQty;
  const stockEl = document.querySelector('.detail-stock');
  if (stockEl) { stockEl.textContent = newQty; }
  await renderPartsList();
}

async function applyQtyInput(id) {
  const val = parseInt(document.getElementById('qtyInput')?.value) || 0;
  await setQty(id, val);
  closeModal();
  await renderPartsList();
  showToast(t('saved'), 'success');
}

async function confirmDeletePart(id) {
  const p = await getPartById(id);
  if (!p) return;
  showAppConfirm(`${t('deleteConfirm')} "${p.name}"?`, async () => {
    await deletePart(id);
    closeModal();
    await renderPartsList();
    showToast(t('deleted'));
  }, true);
}

// ═══════════════════════════════════════════
//  ADD / EDIT PART
// ═══════════════════════════════════════════
const PART_ICONS = ['💡','🟫','🟦','🟧','🟪','🟩','🔺','🔻','🔌','🔋','⚡','🧩','🖥️','💻','📟','🎛️','📡','🌀','🧲','🛞','⚙️','🔧','🛠️','🔩','📦','🧪','🔥','❄️','⭐','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🔷','🔶','⬛','⬜','◾','◽','🔘','⭕','✅','⚠️','📍','🏷️','📐','🧰','🪛','🧵','🧱','🎚️','📏','🧲','🔬','🧭','🪫'];

async function openAddPart() {
  await openPartForm(null);
}
async function openEditPart(id) {
  await openPartForm(id);
}

async function openPartForm(id) {
  const [cats, plats] = await Promise.all([
    getCategories(S.user.username),
    getPlatforms(S.user.username),
  ]);
  const part = id ? await getPartById(id) : null;

  const catOpts = cats.sort((a,b)=>a.name.localeCompare(b.name)).map(c=>
    `<option value="${esc(c.name)}" ${part?.category===c.name?'selected':''}>${esc(c.icon)} ${esc(trCategoryName(c.name))}</option>`
  ).join('');

  const partPlatforms = (part?.platforms || []).map(x => String(x));
  const platChecks = plats.map(p =>
    `<label class="checkbox-item">
      <input type="checkbox" value="${esc(p.name)}" ${partPlatforms.includes(String(p.id)) || partPlatforms.includes(p.name) ? 'checked' : ''}>
      <span style="color:${p.color}">${esc(trPlatformName(p.name))}</span>
     </label>`
  ).join('');

  const iconGrid = PART_ICONS.map(ic =>
    `<div class="icon-opt ${part?.icon===ic?'selected':''}" onclick="selectIcon(this,'${ic}')" data-icon="${ic}">${ic}</div>`
  ).join('');

  const body = `
    <input type="hidden" id="pf_icon" value="${esc(part?.icon||'')}">
    <div class="section-divider">${t('icon')}</div>
    <div class="icon-grid" id="iconGrid">${iconGrid}</div>

    <div class="section-divider">${t('name')} *</div>
    <input class="input" id="pf_name" placeholder="${t('name')}" value="${esc(part?.name||'')}">

    <div class="section-divider">${t('symbol')}</div>
    <input class="input" id="pf_symbol" placeholder="${t('symbol')}" value="${esc(part?.symbol||'')}">

    <div class="section-divider">${t('category')}</div>
    <select class="input" id="pf_category">
      <option value="">– ${t('noneCategory')} –</option>
      ${catOpts}
    </select>

    <div class="section-divider">${t('description')}</div>
    <input class="input" id="pf_description" placeholder="${t('description')}" value="${esc(part?.description||'')}">

    <div class="section-divider">${t('quantity')} / ${t('unit')}</div>
    <div class="input-row">
      <input class="input" type="number" id="pf_quantity" placeholder="0" value="${part?.quantity||0}" min="0">
      <input class="input" id="pf_unit" placeholder="szt." value="${esc(part?.unit||'szt.')}" style="flex:0 0 80px">
    </div>

    <div class="section-divider">${t('minQty')} / ${t('maxQty')}</div>
    <div class="input-row">
      <input class="input" type="number" id="pf_minQty" placeholder="0" value="${part?.minQty||0}" min="0">
      <input class="input" type="number" id="pf_maxQty" placeholder="0" value="${part?.maxQty||0}" min="0">
    </div>

    <div class="section-divider">📍 ${t('location')}</div>
    <input class="input" id="pf_location" placeholder="${t('locationHint')}" value="${esc(part?.location||'')}">

    <div class="section-divider">${t('price')} / waluta</div>
    <div class="input-row">
      <input class="input" type="number" id="pf_price" placeholder="0.00" value="${part?.price||''}" step="0.01" min="0">
      <input class="input" id="pf_currency" placeholder="PLN" value="${esc(part?.currency||'PLN')}" style="flex:0 0 70px">
    </div>

    <div class="section-divider">${t('compatPlatforms')}</div>
    <div class="checkbox-group">${platChecks||`<span style="color:var(--sub);font-size:13px">${t('noPlatformsHint')}</span>`}</div>

    <div class="section-divider">${t('datasheet')}</div>
    <input class="input" id="pf_datasheet" placeholder="https://..." value="${esc(part?.datasheet||'')}">

    <div class="section-divider">${t('notes')}</div>
    <textarea class="input" id="pf_notes" placeholder="${t('notes')}">${esc(part?.notes||'')}</textarea>
  `;

  const footer = `
    <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
    <button class="btn btn-primary"   onclick="savePart(${id||'null'})">${t('save')}</button>
  `;

  showModal(part ? t('editPart') : t('addPart'), body, footer);
}

function selectIcon(el, icon) {
  document.querySelectorAll('.icon-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('pf_icon').value = icon;
}

async function savePart(id) {
  const get = elId => document.getElementById(elId);
  const name = get('pf_name')?.value.trim();
  if (!name) { showToast(t('fillFields'), 'error'); return; }

  const platBoxes = document.querySelectorAll('#modalBody input[type=checkbox]');
  const selectedPlats = Array.from(platBoxes).filter(cb=>cb.checked).map(cb=>cb.value);
  const selectedCategory = get('pf_category')?.value || '';
  const cats = await getCategories(S.user.username);
  const catIcon = cats.find(c => c.name === selectedCategory)?.icon || '📦';
  const selectedIcon = get('pf_icon')?.value || catIcon;

  const data = {
    icon:        selectedIcon,
    name,
    symbol:      get('pf_symbol')?.value.trim()      || '',
    category:    selectedCategory,
    description: get('pf_description')?.value.trim() || '',
    quantity:    parseFloat(get('pf_quantity')?.value)||0,
    unit:        get('pf_unit')?.value.trim()         || 'szt.',
    minQty:      parseFloat(get('pf_minQty')?.value)  || 0,
    maxQty:      parseFloat(get('pf_maxQty')?.value)  || 0,
    location:    get('pf_location')?.value.trim()     || '',
    price:       parseFloat(get('pf_price')?.value)   || 0,
    currency:    get('pf_currency')?.value.trim()     || 'PLN',
    platforms:   selectedPlats,
    datasheet:   get('pf_datasheet')?.value.trim()   || '',
    notes:       get('pf_notes')?.value.trim()        || '',
  };

  if (id) await updatePart(id, data);
  else     await addPart(S.user.username, data);

  closeModal();
  await renderPartsList();
  showToast(t('saved'), 'success');
}

// ═══════════════════════════════════════════
//  PART HISTORY
// ═══════════════════════════════════════════
async function openHistory(id) {
  const [part, entries] = await Promise.all([getPartById(id), getLog(S.user.username, id)]);
  const actions = { add:'✅ Dodano', edit:'✏️ Edycja', 'in':'📥 Przyjęcie', out:'📤 Wydanie', set:'🔧 Ustaw' };
  const rows = entries.map(e => {
    const d = new Date(e.at);
    const dt = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
    const meta = e.meta?.delta ? ` (${e.meta.delta>0?'+':''}${e.meta.delta})` : e.meta?.prev!=null ? ` ${e.meta.prev}→${e.meta.next}` : '';
    return `<div class="manager-item"><div class="manager-item-name">${actions[e.action]||e.action}${meta}</div><div style="font-size:11px;color:var(--sub)">${dt}</div></div>`;
  }).join('') || `<div style="color:var(--sub);text-align:center;padding:24px">${t('logEmpty')}</div>`;

  showModal(t('partHistory') + ': ' + esc(part?.name||''), `<div class="manager-list">${rows}</div>`, `<button class="btn btn-secondary w100" onclick="closeModal()">${t('close')}</button>`);
}

// ═══════════════════════════════════════════
//  SEARCH
// ═══════════════════════════════════════════
function renderSearch(mc) {
  mc = mc || document.getElementById('mainContent');
  mc.innerHTML = `
    <div class="page-header"><div class="page-title">🔍 ${t('search')}</div></div>
    <div class="search-bar-wrap">
      <input class="input search-input" id="searchInput" placeholder="${t('search')}..." value="${esc(S.searchQuery)}" oninput="doSearch(this.value)" autofocus>
    </div>
    <div id="searchResults"></div>
  `;
  if (S.searchQuery) doSearch(S.searchQuery);
}

async function doSearch(q) {
  S.searchQuery = q;
  const el = document.getElementById('searchResults');
  if (!el) return;
  if (!q.trim()) { el.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-sub">${t('noSearch')}</div></div>`; return; }
  const parts = await getParts(S.user.username, { q });
  if (parts.length === 0) { el.innerHTML = `<div class="empty-state"><div class="empty-sub">${t('noResults')}</div></div>`; return; }
  const cats = Object.fromEntries((await getCategories(S.user.username)).map(c=>[c.name,c]));
  const grid = makeEl('div','parts-grid');
  for (const p of parts) {
    const catIcon = cats[p.category]?.icon||'📦';
    const card = makeEl('div','part-card');
    card.innerHTML = `<div class="part-card-top"><div class="part-card-icon">${esc(p.icon||catIcon)}</div><div class="part-card-info"><div class="part-card-name">${esc(trPartName(p.name))}</div><div class="part-card-meta">${esc(p.symbol||'')} ${esc(p.category||'')} ${p.location?'📍'+esc(p.location):''}</div></div><div class="part-card-right"><div class="part-card-stock">${p.quantity}</div><div class="part-card-unit">${esc(trUnit(p.unit||'szt.'))}</div></div></div>`;
    card.onclick = () => openPartDetail(p.id);
    grid.appendChild(card);
  }
  el.innerHTML = ''; el.appendChild(grid);
}
function openSearch() { navigate('search'); }

// ═══════════════════════════════════════════
//  CATEGORY MANAGER
// ═══════════════════════════════════════════
async function openCategoryManager() {
  closeSidebar();
  const cats = await getCategories(S.user.username);
  const catIcons = ['💡','🟫','🟦','🟧','🟪','🟩','🔺','🔻','🔌','🔋','⚡','🧩','🖥️','💻','📟','🎛️','📡','🌀','🧲','🛞','⚙️','🔧','🛠️','🔩','📦','🧪','🔥','❄️','⭐','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🔷','🔶','⬛','⬜','◾','◽','🔘','⭕','✅','⚠️','📍','🏷️','📐','🧰','🪛','🧵','🧱','🎚️','📏','🔬','🧭','🪫'];
  const rows = cats.sort((a,b)=>a.name.localeCompare(b.name)).map(c =>
    `<div class="manager-item">
       <div style="font-size:20px">${esc(c.icon)}</div>
       <div class="manager-item-name">${esc(c.name)}</div>
       <div class="manager-item-actions">
         <button class="btn btn-secondary btn-sm" onclick="editCategoryDlg(${c.id},'${esc(c.name)}','${esc(c.icon)}')">✏️</button>
         <button class="btn btn-danger btn-sm"    onclick="deleteCategoryConfirm(${c.id},'${esc(c.name)}')">🗑</button>
       </div>
     </div>`
  ).join('');

  const iconOpts = catIcons.map(i=>`<div class="icon-opt" onclick="selectIcon(this,'${i}')" data-icon="${i}">${i}</div>`).join('');

  const body = `
    <div class="manager-list">${rows||`<div style="color:var(--sub);text-align:center;padding:16px">${t('noCategories')}</div>`}</div>
    <div class="section-divider">${t('addCategory')}</div>
    <input type="hidden" id="newCatIcon" value="📦">
    <div class="icon-grid">${iconOpts}</div>
    <div class="input-row mt12">
      <input class="input" id="newCatName" placeholder="Nazwa kategorii...">
      <button class="btn btn-primary" onclick="doAddCategory()">＋</button>
    </div>
  `;
  showModal(t('catManager'), body, `<button class="btn btn-secondary w100" onclick="closeModal()">${t('close')}</button>`);
}

async function doAddCategory() {
  const name = document.getElementById('newCatName')?.value.trim();
  const icon = document.getElementById('newCatIcon')?.value || '📦';
  if (!name) { showToast(t('fillFields'),'error'); return; }
  await addCategory(S.user.username, name, icon);
  await renderSidebar();
  showToast(t('saved'),'success');
  closeModal();
  openCategoryManager();
}

async function editCategoryDlg(id, name, icon) {
  const catIcons = ['💡','🟫','🟦','🟧','🟪','🟩','🔺','🔻','🔌','🔋','⚡','🧩','🖥️','💻','📟','🎛️','📡','🌀','🧲','🛞','⚙️','🔧','🛠️','🔩','📦','🧪','🔥','❄️','⭐','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🔷','🔶','⬛','⬜','◾','◽','🔘','⭕','✅','⚠️','📍','🏷️','📐','🧰','🪛','🧵','🧱','🎚️','📏','🔬','🧭','🪫'];
  const iconOpts = catIcons.map(i=>`<div class="icon-opt ${i===icon?'selected':''}" onclick="selectIcon(this,'${i}')" data-icon="${i}">${i}</div>`).join('');
  const body = `
    <input type="hidden" id="editCatIcon" value="${esc(icon)}">
    <div class="icon-grid">${iconOpts}</div>
    <div class="form-group mt12">
      <label class="form-label">${t('name')}</label>
      <input class="input" id="editCatName" value="${esc(name)}">
    </div>
  `;
  showModal(t('editCategory'), body, `
    <button class="btn btn-secondary" onclick="openCategoryManager()">${t('cancel')}</button>
    <button class="btn btn-primary"   onclick="doEditCategory(${id})">💾 ${t('save')}</button>
  `);
}

async function doEditCategory(id) {
  const name = document.getElementById('editCatName')?.value.trim();
  const icon = document.getElementById('editCatIcon')?.value || '📦';
  if (!name) return;
  await updateCategory(id, name, icon);
  await renderSidebar();
  showToast(t('saved'),'success');
  closeModal();
}

async function deleteCategoryConfirm(id, name) {
  showAppConfirm(`${t('deleteConfirm')} "${name}"?`, async () => {
    await deleteCategory(id);
    await renderSidebar();
    showToast(t('deleted'));
    closeModal();
    openCategoryManager();
  }, true);
}

async function openAddSubcategory(parentId, parentName, parentIcon='📦') {
  closeSidebar();
  const title = S.lang === 'pl' ? 'Dodaj podkategorię' : (S.lang === 'en' ? 'Add subcategory' : 'Añadir subcategoría');
  const body = `
    <div class="form-group">
      <label class="form-label">${S.lang === 'pl' ? 'Kategoria nadrzędna' : (S.lang === 'en' ? 'Parent category' : 'Categoría principal')}</label>
      <div class="manager-item"><div style="font-size:20px">${esc(parentIcon)}</div><div class="manager-item-name">${esc(trCategoryName(parentName))}</div></div>
    </div>
    <input type="hidden" id="newSubCatIcon" value="${esc(parentIcon)}">
    <div class="form-group">
      <label class="form-label">${t('name')}</label>
      <input class="input" id="newSubCatName" placeholder="${S.lang === 'pl' ? 'np. LED 5mm' : (S.lang === 'en' ? 'e.g. 5mm LEDs' : 'p. ej. LEDs 5mm')}">
    </div>
  `;
  showModal(title, body, `
    <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
    <button class="btn btn-primary" onclick="doAddSubcategory(${parentId})">${t('save')}</button>
  `);
}

async function doAddSubcategory(parentId) {
  const name = document.getElementById('newSubCatName')?.value.trim();
  const icon = document.getElementById('newSubCatIcon')?.value || '📦';
  if (!name) { showToast(t('fillFields'), 'error'); return; }
  await addCategory(S.user.username, name, icon, parentId);
  await renderSidebar();
  closeModal();
  showToast(t('saved'), 'success');
}



// ═══════════════════════════════════════════
//  PLATFORM MANAGER
// ═══════════════════════════════════════════
async function openPlatformManager() {
  closeSidebar();
  const plats = await getPlatforms(S.user.username);
  const rows = plats.sort((a,b)=>a.name.localeCompare(b.name)).map(p =>
    `<div class="manager-item">
       <div style="width:14px;height:14px;border-radius:50%;background:${p.color};flex-shrink:0"></div>
       <div class="manager-item-name">${esc(trPlatformName(p.name))}</div>
       <div class="manager-item-actions">
         <button class="btn btn-secondary btn-sm" onclick="editPlatformDlg(${p.id},'${esc(p.name)}','${esc(p.color)}')">✏️</button>
         <button class="btn btn-danger btn-sm"    onclick="deletePlatformConfirm(${p.id},'${esc(p.name)}')">🗑</button>
       </div>
     </div>`
  ).join('');
  const body = `
    <div class="manager-list">${rows||`<div style="color:var(--sub);text-align:center;padding:16px">${t('noPlatforms')}</div>`}</div>
    <div class="section-divider">${t('addPlatform')}</div>
    <div class="input-row mt8">
      <input class="input" id="newPlatName" placeholder="np. Arduino, ESP32...">
      <input type="color" id="newPlatColor" value="#ff0000" style="width:44px;height:44px;border:none;background:none;cursor:pointer">
      <button class="btn btn-primary" onclick="doAddPlatform()">＋</button>
    </div>
  `;
  showModal(t('platManager'), body, `<button class="btn btn-secondary w100" onclick="closeModal()">${t('close')}</button>`);
}

async function doAddPlatform() {
  const name  = document.getElementById('newPlatName')?.value.trim();
  const color = document.getElementById('newPlatColor')?.value || '#ff0000';
  if (!name) { showToast(t('fillFields'),'error'); return; }
  await addPlatform(S.user.username, name, color);
  await renderSidebar();
  showToast(t('saved'),'success');
  closeModal();
  openPlatformManager();
}

async function editPlatformDlg(id, name, color) {
  const body = `
    <div class="form-group"><label class="form-label">${t('name')}</label><input class="input" id="editPlatName" value="${esc(name)}"></div>
    <div class="form-group"><label class="form-label">${t('color')}</label><input type="color" id="editPlatColor" value="${esc(color)}" style="width:60px;height:44px;border:none;background:none;cursor:pointer"></div>
  `;
  showModal(t('editPlatform'), body, `
    <button class="btn btn-secondary" onclick="openPlatformManager()">${t('cancel')}</button>
    <button class="btn btn-primary"   onclick="doEditPlatform(${id})">💾 ${t('save')}</button>
  `);
}
async function doEditPlatform(id) {
  const name  = document.getElementById('editPlatName')?.value.trim();
  const color = document.getElementById('editPlatColor')?.value || '#388BFD';
  if (!name) return;
  await updatePlatform(id, name, color);
  await renderSidebar(); showToast(t('saved'),'success'); closeModal();
}
async function deletePlatformConfirm(id, name) {
  showAppConfirm(`${t('deleteConfirm')} "${name}"?`, async () => {
    await deletePlatform(id);
    await renderSidebar();
    showToast(t('deleted'));
    closeModal();
    openPlatformManager();
  }, true);
}


// ═══════════════════════════════════════════
//  SAFE CONFIRM DIALOG - no native file:// alert
// ═══════════════════════════════════════════
function escConfirmText(v) {
  return String(v ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));
}

function showAppConfirm(message, onConfirm, danger = true) {
  let overlay = document.getElementById('appConfirmOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'appConfirmOverlay';
    overlay.className = 'app-confirm-overlay hidden';
    overlay.innerHTML = `
      <div class="app-confirm-box" role="dialog" aria-modal="true">
        <div class="app-confirm-title" id="appConfirmTitle"></div>
        <div class="app-confirm-message" id="appConfirmMessage"></div>
        <div class="app-confirm-actions">
          <button type="button" class="app-confirm-btn app-confirm-cancel" id="appConfirmCancel"></button>
          <button type="button" class="app-confirm-btn app-confirm-ok" id="appConfirmOk"></button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  document.getElementById('appConfirmTitle').textContent = t('confirm');
  document.getElementById('appConfirmMessage').innerHTML = escConfirmText(message);
  document.getElementById('appConfirmCancel').textContent = t('cancel');
  document.getElementById('appConfirmOk').textContent = t('confirm');

  const ok = document.getElementById('appConfirmOk');
  const cancel = document.getElementById('appConfirmCancel');
  ok.classList.toggle('danger', !!danger);

  const close = () => overlay.classList.add('hidden');
  cancel.onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  ok.onclick = async () => {
    await onConfirm();
    close();
  };

  overlay.classList.remove('hidden');
}


// ═══════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════
function renderSettings(mc) {
  mc = mc || document.getElementById('mainContent');
  const langOpts = [
    {code:'pl',label:'🇵🇱 Polski'},
    {code:'en',label:'🇬🇧 English'},
    {code:'es',label:'🇪🇸 Español'},
  ];

  mc.innerHTML = `
    <div class="page-header"><div class="page-title">⚙️ ${t('settings')}</div></div>

    <div class="settings-section">
      <div class="settings-section-title">${t('userSettings')}</div>
      <div class="settings-row">
        <div><div class="settings-row-label">👤 ${t('username')}</div><div class="settings-row-sub">${esc(S.user.username)}</div></div>
      </div>
      <div class="settings-row">
        <div><div class="settings-row-label">📦 ${t('stockProfile')}</div><div class="settings-row-sub">${esc(getProfileLabels()[S.user.settings?.stockProfile || 'electronics'] || getProfileLabels().electronics)}</div></div>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">🎨 ${t('themeLabel')}</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm ${S.theme==='dark'?'btn-primary':'btn-secondary'}" onclick="setTheme('dark')">${t('dark')}</button>
          <button class="btn btn-sm ${S.theme==='light'?'btn-primary':'btn-secondary'}" onclick="setTheme('light')">${t('light')}</button>
        </div>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">🌐 ${t('language')}</div>
        <select class="input" style="max-width:180px" onchange="setLang(this.value)">
          ${langOpts.map(l=>`<option value="${l.code}" ${S.lang===l.code?'selected':''}>${l.label}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">${t('backup')}</div>
      <div class="settings-row">
        <div class="settings-row-label">📤 ${t('exportJson')}</div>
        <button class="btn btn-secondary btn-sm" onclick="exportData()">${t('export')}</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-label">📥 ${t('importJson')}</div>
        <button class="btn btn-secondary btn-sm" onclick="startImport()">${t('import')}</button>
      </div>
    </div>

    <div class="settings-section danger-settings">
      <div class="settings-section-title">${t('dangerZone')}</div>
      <div class="settings-row">
        <div><div class="settings-row-label" style="color:var(--danger)">🧹 ${t('deleteStock')}</div><div class="settings-row-sub">${t('deleteStockSub')}</div></div>
        <button class="btn btn-danger btn-sm" onclick="confirmDeleteStockOnly()">${t('delete')}</button>
      </div>
      <div class="settings-row">
        <div><div class="settings-row-label" style="color:var(--danger)">🗑 ${t('deleteAllData')}</div><div class="settings-row-sub">${t('deleteAllSub')}</div></div>
        <button class="btn btn-danger btn-sm" onclick="confirmDeleteAll()">${t('delete')}</button>
      </div>
    </div>


    <div class="settings-section support-section">
      <div class="settings-section-title">${t('supportProject')}</div>
      <div class="support-card">
        <div class="support-tv">
          <div class="support-tv-screen">📺</div>
          <div class="support-tv-stand"></div>
        </div>
        <div class="support-copy">
          <div class="support-title">⚡ ${t('supportProject')}</div>
          <div class="support-text">${t('supportProjectText')}</div>
          <div class="support-points-card" id="supportPointsCard">
            <div class="support-points-main">
              <span class="support-points-badge">⚡</span>
              <span class="support-points-label">${t('supportPoints')}</span>
              <strong class="support-points-count">${getSupportPoints()}</strong>
            </div>
            <div class="support-points-icons" aria-hidden="true">${supportPointIcons(getSupportPoints())}</div>
          </div>
          <button class="btn btn-primary support-btn" onclick="supportProject()">📺 ${t('watchAd')}</button>
          ${privacyOptionsRequired ? `<button class="btn btn-secondary support-btn" onclick="showAdPrivacyOptions()">🔒 ${t('privacySettings')}</button>` : ''}
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">${t('accountAbout')}</div>
      <div class="settings-row"><div><div class="settings-row-label">ElectroStock</div><div class="settings-row-sub">${t('version')} 1.0.3</div></div></div>
      <div class="settings-row"><div><div class="settings-row-label">${t('storage')}</div><div class="settings-row-sub">${t('localData')}</div></div></div>
    </div>
  `;
}

async function setTheme(theme) {
  S.theme = theme; applyTheme();
  await updateUserSettings(S.user.username, { theme });
  renderSettings();
}

async function setLang(lang) {
  S.lang = ['pl','en','es'].includes(lang) ? lang : 'en';
  localStorage.setItem('es_lang', S.lang);
  await updateUserSettings(S.user.username, { lang: S.lang });
  navigate(S.view);
}



function supportProject() {
  if (window.AndroidBridge && typeof window.AndroidBridge.showRewardedAd === 'function') {
    try {
      window.AndroidBridge.showRewardedAd();
      return;
    } catch (e) {
      console.warn('Rewarded ad failed', e);
    }
  }
  showToast(t('adUnavailable'), 'error');
}

window.rewardedAdFinished = function() {
  localStorage.setItem('es_support_points', String(getSupportPoints() + 1));
  if (S.view === 'settings') {
    renderSettings();
    requestAnimationFrame(() => {
      const card = document.getElementById('supportPointsCard');
      if (card) card.classList.add('support-points-earned');
    });
  } else {
    showToast(t('supportThanks'), 'success');
  }
};

window.rewardedAdClosed = function(watched) {
  if (watched) showToast(t('supportThanks'), 'success');
};

window.rewardedAdUnavailable = function(reason) {
  showToast(reason === 'loading' ? t('adLoading') : t('adUnavailable'), 'error');
};

window.rewardedAdAvailability = function(available) {
  const button = document.querySelector('.support-btn');
  if (button) button.dataset.adReady = available ? 'true' : 'false';
};

window.privacyOptionsAvailability = function(required) {
  privacyOptionsRequired = Boolean(required);
  if (S.view === 'settings') renderSettings();
};

window.privacyOptionsError = function() {
  showToast(t('privacyError'), 'error');
};

function showAdPrivacyOptions() {
  if (window.AndroidBridge && typeof window.AndroidBridge.showPrivacyOptions === 'function') {
    window.AndroidBridge.showPrivacyOptions();
  } else {
    showToast(t('privacyError'), 'error');
  }
}


async function confirmDeleteStockOnly() {
  showAppConfirm(`${t('deleteStock')}?`, async () => {
    const parts = await getParts(S.user.username);
    for (const p of parts) await deletePart(p.id);
    if (typeof deleteLogForUser === 'function') await deleteLogForUser(S.user.username);
    S.filterCat = null;
    S.filterPlat = null;
    S.view = 'all';
    await renderSidebar();
    showToast(t('deleted'));
    navigate('all');
  }, true);
}

async function confirmDeleteAll() {
  showAppConfirm(`${t('deleteAllData')}?`, async () => {
    const [parts, cats, plats] = await Promise.all([
      getParts(S.user.username),
      getCategories(S.user.username),
      getPlatforms(S.user.username),
    ]);
    for (const p of parts)  await deletePart(p.id);
    for (const c of cats)   await deleteCategory(c.id);
    for (const p of plats)  await deletePlatform(p.id);
    if (typeof deleteLogForUser === 'function') await deleteLogForUser(S.user.username);
    S.filterCat = null;
    S.filterPlat = null;
    S.view = 'all';
    await renderSidebar();
    showToast(t('deleted'));
    navigate('all');
  }, true);
}

// ═══════════════════════════════════════════
//  EXPORT / IMPORT
// ═══════════════════════════════════════════
async function exportData() {
  const data = await exportUserData(S.user.username);
  const json = JSON.stringify(data, null, 2);
  const filename = `electrostock_${S.user.username}_${new Date().toISOString().slice(0,10)}.json`;
  if (window.AndroidBridge) {
    try {
      window.AndroidBridge.exportJson(filename, json);
      return;
    } catch (e) {
      console.warn('Native export failed, using browser fallback', e);
    }
  }
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(t('exportOk'), 'success');
}

function startImport() {
  if (window.AndroidBridge) {
    try {
      window.AndroidBridge.importJson();
      return;
    } catch (e) {
      console.warn('Native import failed, using browser fallback', e);
    }
  }
  document.getElementById('importFile').click();
}

async function handleImportedJson(text) {
  try {
    const data = JSON.parse(text);
    await importUserData(S.user.username, data);
    await renderSidebar();
    await renderPartsList();
    showToast(t('importOk'), 'success');
  } catch (e) {
    console.error(e);
    showToast(t('importErr'), 'error');
  }
}

async function importData(event) {
  const file = event.target.files[0]; if (!file) return;
  await handleImportedJson(await file.text());
  event.target.value = '';
}

window.receiveImportedJson = function(text) { handleImportedJson(text); };
window.nativeExportDone = function(ok) { showToast(ok ? t('exportOk') : t('error'), ok ? 'success' : 'error'); };
window.nativeImportError = function() { showToast(t('importErr'), 'error'); };

// ═══════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════
function showModal(title, body, footer='') {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML   = body;
  document.getElementById('modalFooter').innerHTML = footer;
  document.getElementById('modalOverlay').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}
function closeModalOuter(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

// ═══════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════
let toastTimer = null;
function showToast(msg, type='') {
  const el = document.getElementById('toast');
  el.textContent = msg; el.className = `toast ${type}`;
  el.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2400);
}

// ═══════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════
function makeEl(tag, className='', text='') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}
function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Enter key in login form
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (!document.getElementById('loginView').classList.contains('hidden')) doAuth();
  }
});
