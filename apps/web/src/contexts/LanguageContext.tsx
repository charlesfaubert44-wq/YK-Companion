'use client';

import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'fr' | 'zh' | 'ja' | 'ko' | 'es' | 'de' | 'vi' | 'tl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    visiting: 'Visiting',
    living: 'Living Here',
    moving: 'Moving Here',
    slogan: 'Because Nobody Should Face -40° Alone',
    are_you: 'Are you...',
    plan_your_trip: 'Plan your trip',
    explore_your_city: 'Explore your city',
    start_your_move: 'Start your move',
    visiting_desc:
      'Aurora forecasts, top attractions, seasonal guides, hidden gems, and local experiences to make your Yellowknife adventure unforgettable.',
    living_desc:
      'Garage sales, local events, seasonal activities, community resources, and insider tips for making the most of life in Yellowknife.',
    moving_desc:
      'Housing market insights, job opportunities, cost of living calculator, moving checklist, and everything you need to relocate to Yellowknife.',
    footer: 'Made with ❤️ in Yellowknife, Northwest Territories',
    sign_in: 'Sign In',
    sign_out: 'Sign Out',
  },
  fr: {
    home: 'Accueil',
    about: 'À propos',
    contact: 'Contact',
    visiting: 'En visite',
    living: 'Résident',
    moving: 'Déménagement',
    slogan: 'Parce que personne ne devrait affronter -40° seul',
    are_you: 'Êtes-vous...',
    plan_your_trip: 'Planifiez votre voyage',
    explore_your_city: 'Explorez votre ville',
    start_your_move: 'Commencez votre déménagement',
    visiting_desc:
      'Prévisions aurorales, attractions principales, guides saisonniers et expériences locales pour rendre votre aventure à Yellowknife inoubliable.',
    living_desc:
      'Ventes de garage, événements locaux, activités saisonnières et ressources communautaires pour profiter au maximum de la vie à Yellowknife.',
    moving_desc:
      "Informations sur le marché immobilier, opportunités d'emploi, calculateur du coût de la vie et tout ce dont vous avez besoin pour déménager à Yellowknife.",
    footer: 'Fait avec ❤️ à Yellowknife, Territoires du Nord-Ouest',
    sign_in: 'Se connecter',
    sign_out: 'Se déconnecter',
  },
  zh: {
    home: '首页',
    about: '关于',
    contact: '联系',
    visiting: '游客',
    living: '居民',
    moving: '搬迁',
    slogan: '因为没有人应该独自面对零下40度',
    are_you: '您是...',
    plan_your_trip: '计划您的旅行',
    explore_your_city: '探索您的城市',
    start_your_move: '开始搬迁',
    visiting_desc: '极光预测、热门景点、季节指南、隐藏宝藏和当地体验，让您的耶洛奈夫之旅难忘。',
    living_desc: '车库销售、本地活动、季节性活动、社区资源和内部技巧，充分利用耶洛奈夫的生活。',
    moving_desc:
      '房地产市场洞察、工作机会、生活成本计算器、搬家清单以及您搬迁到耶洛奈夫所需的一切。',
    footer: '在加拿大西北地区耶洛奈夫用❤️制作',
    sign_in: '登录',
    sign_out: '登出',
  },
  ja: {
    home: 'ホーム',
    about: '概要',
    contact: 'お問い合わせ',
    visiting: '訪問者',
    living: '居住者',
    moving: '移住',
    slogan: '誰も-40度に一人で立ち向かうべきではないから',
    are_you: 'あなたは...',
    plan_your_trip: '旅行を計画',
    explore_your_city: '街を探索',
    start_your_move: '移住を開始',
    visiting_desc:
      'オーロラ予報、人気アトラクション、季節のガイド、隠れた名所、イエローナイフの冒険を忘れられないものにする地元体験。',
    living_desc:
      'ガレージセール、地元イベント、季節のアクティビティ、コミュニティリソース、イエローナイフでの生活を最大限に活用するためのインサイダーヒント。',
    moving_desc:
      '住宅市場の洞察、求人情報、生活費計算機、引っ越しチェックリスト、イエローナイフへの移住に必要なすべて。',
    footer: 'ノースウエスト準州イエローナイフで❤️を込めて制作',
    sign_in: 'サインイン',
    sign_out: 'サインアウト',
  },
  ko: {
    home: '홈',
    about: '소개',
    contact: '연락처',
    visiting: '방문객',
    living: '거주자',
    moving: '이주',
    slogan: '아무도 영하 40도를 혼자 마주해서는 안 되니까',
    are_you: '당신은...',
    plan_your_trip: '여행 계획하기',
    explore_your_city: '도시 탐험하기',
    start_your_move: '이주 시작하기',
    visiting_desc:
      '오로라 예보, 인기 명소, 계절 가이드, 숨은 보석, 그리고 옐로나이프 모험을 잊을 수 없게 만들 현지 경험.',
    living_desc:
      '차고 세일, 지역 이벤트, 계절 활동, 커뮤니티 리소스, 옐로나이프 생활을 최대한 활용하기 위한 내부자 팁.',
    moving_desc:
      '주택 시장 통찰력, 취업 기회, 생활비 계산기, 이사 체크리스트, 옐로나이프로 이주하는 데 필요한 모든 것.',
    footer: '노스웨스트 준주 옐로나이프에서 ❤️로 제작',
    sign_in: '로그인',
    sign_out: '로그아웃',
  },
  es: {
    home: 'Inicio',
    about: 'Acerca de',
    contact: 'Contacto',
    visiting: 'Visitando',
    living: 'Viviendo aquí',
    moving: 'Mudándose',
    slogan: 'Porque nadie debería enfrentar -40° solo',
    are_you: '¿Eres...',
    plan_your_trip: 'Planifica tu viaje',
    explore_your_city: 'Explora tu ciudad',
    start_your_move: 'Comienza tu mudanza',
    visiting_desc:
      'Pronósticos de auroras, atracciones principales, guías estacionales, joyas ocultas y experiencias locales para hacer tu aventura en Yellowknife inolvidable.',
    living_desc:
      'Ventas de garaje, eventos locales, actividades estacionales, recursos comunitarios y consejos internos para aprovechar al máximo la vida en Yellowknife.',
    moving_desc:
      'Información del mercado inmobiliario, oportunidades de empleo, calculadora de costo de vida, lista de mudanza y todo lo que necesitas para mudarte a Yellowknife.',
    footer: 'Hecho con ❤️ en Yellowknife, Territorios del Noroeste',
    sign_in: 'Iniciar sesión',
    sign_out: 'Cerrar sesión',
  },
  de: {
    home: 'Startseite',
    about: 'Über uns',
    contact: 'Kontakt',
    visiting: 'Besucher',
    living: 'Einwohner',
    moving: 'Umzug',
    slogan: 'Weil niemand -40° allein gegenüberstehen sollte',
    are_you: 'Bist du...',
    plan_your_trip: 'Plane deine Reise',
    explore_your_city: 'Erkunde deine Stadt',
    start_your_move: 'Beginne deinen Umzug',
    visiting_desc:
      'Polarlichter-Vorhersagen, Top-Attraktionen, saisonale Führer, versteckte Schätze und lokale Erlebnisse, um dein Yellowknife-Abenteuer unvergesslich zu machen.',
    living_desc:
      'Garagenverkäufe, lokale Veranstaltungen, saisonale Aktivitäten, Community-Ressourcen und Insider-Tipps, um das Beste aus dem Leben in Yellowknife zu machen.',
    moving_desc:
      'Immobilienmarkt-Einblicke, Jobmöglichkeiten, Lebenshaltungskosten-Rechner, Umzugscheckliste und alles, was du brauchst, um nach Yellowknife umzuziehen.',
    footer: 'Mit ❤️ in Yellowknife, Nordwest-Territorien erstellt',
    sign_in: 'Anmelden',
    sign_out: 'Abmelden',
  },
  vi: {
    home: 'Trang chủ',
    about: 'Giới thiệu',
    contact: 'Liên hệ',
    visiting: 'Du khách',
    living: 'Cư dân',
    moving: 'Chuyển đến',
    slogan: 'Vì không ai nên đối mặt với -40° một mình',
    are_you: 'Bạn là...',
    plan_your_trip: 'Lên kế hoạch chuyến đi',
    explore_your_city: 'Khám phá thành phố',
    start_your_move: 'Bắt đầu chuyển nhà',
    visiting_desc:
      'Dự báo cực quang, điểm tham quan hàng đầu, hướng dẫn theo mùa, viên ngọc ẩn và trải nghiệm địa phương để làm cho cuộc phiêu lưu Yellowknife của bạn khó quên.',
    living_desc:
      'Bán hàng xe hơi, sự kiện địa phương, hoạt động theo mùa, tài nguyên cộng đồng và mẹo nội bộ để tận dụng tối đa cuộc sống ở Yellowknife.',
    moving_desc:
      'Thông tin thị trường nhà đất, cơ hội việc làm, máy tính chi phí sinh hoạt, danh sách kiểm tra chuyển nhà và mọi thứ bạn cần để chuyển đến Yellowknife.',
    footer: 'Được tạo với ❤️ tại Yellowknife, Vùng Lãnh thổ Tây Bắc',
    sign_in: 'Đăng nhập',
    sign_out: 'Đăng xuất',
  },
  tl: {
    home: 'Home',
    about: 'Tungkol',
    contact: 'Kontakin',
    visiting: 'Bumibisita',
    living: 'Naninirahan',
    moving: 'Lumilipat',
    slogan: 'Dahil walang dapat harapin ang -40° mag-isa',
    are_you: 'Ikaw ba ay...',
    plan_your_trip: 'Planuhin ang iyong biyahe',
    explore_your_city: 'Tuklasin ang iyong lungsod',
    start_your_move: 'Simulan ang iyong paglipat',
    visiting_desc:
      'Mga hula ng aurora, nangungunang atraksyon, seasonal guides, nakatagong hiyas, at lokal na karanasan upang gawing hindi malilimutan ang iyong Yellowknife adventure.',
    living_desc:
      'Garage sales, lokal na kaganapan, seasonal activities, community resources, at insider tips para sa paggawa ng pinakamahusay sa buhay sa Yellowknife.',
    moving_desc:
      'Mga insight sa housing market, pagkakataon sa trabaho, calculator ng gastos sa pamumuhay, checklist sa paglipat, at lahat ng kailangan mo upang lumipat sa Yellowknife.',
    footer: 'Ginawa nang may ❤️ sa Yellowknife, Northwest Territories',
    sign_in: 'Mag-sign in',
    sign_out: 'Mag-sign out',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Use lazy initialization to load from localStorage immediately
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yk-buddy-language');
      if (saved && saved in translations) {
        return saved as Language;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('yk-buddy-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
