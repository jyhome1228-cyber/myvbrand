(() => {
  const newsTitles = {"legacy-171831533":"Vietnamese KOL Xenia Joins Getz-Beauty, Signaling Entry into Korea","legacy-170448224":"V Labs CEO Jangwook Lee on E-Commerce Where Businesses and Consumers Grow Together","legacy-170004786":"Influencer E-Commerce Association and V Labs Join Forces for a Global MYV Prosumer Ecosystem","legacy-169080625":"V Labs CEO Receives Award for Consumer Curation at the 2025 Influencer Awards","legacy-168408090":"Meet Drunken Rose, a Signature Fragrance from Scentwiki","legacy-168310159":"CoffeeTools: Bringing the Aroma of Coffee Into Everyday Life","legacy-168029754":"MYV: Building an E-Commerce Model Where Consumption Creates Value","legacy-167950862":"Gentle Dermocosmetics Brand Dr. Gentle Joins MYV","legacy-167829500":"Pet Brand OnesPapa Expands on MYV with Freeze-Dried Dog Treats","legacy-167537778":"MYV Welcomes Traditional Korean Black Goat Extract and Premium Red Ginseng Gift Sets","legacy-167321731":"Premium Soy Milk Brand Duyubonsaek Joins MYV","legacy-167275727":"MYV: A Platform Where Consumption Becomes Shared Value","weeklypeople-interview":"V Labs CEO Jangwook Lee Featured in Weekly People Interview","myv-patent-registration":"V Labs Announces Three Patents Related to MYV","value-consumption-platform":"V Labs Develops MYV, a Value-Driven Commerce Platform for Shared Growth","dentipromised-blind-test":"Dentipromised Toothpaste: Blind Product Test","myv-renewal-2024":"MYV Marks Its 2024 Online Mall Renewal with a Launch Event","silkyhair-blind-test":"Silkyhair Hair Essence: Blind Product Test","vpoint-friend-event":"MYV Announces 2024 Invite-a-Friend V.Point Campaign","assistfit-collaboration":"V Labs Broadens Consumer Engagement with AssistFit Media","luluan-brand-launch":"Eco-Friendly Portable Bidet Brand Luluan Joins MYV","anti-hairloss-blind-test":"Anti-Hairloss Shampoo: Blind Product Test","pearlcare-launch":"Beauty and Healthcare Brand Pearlcare Joins MYV","black-friday-2024":"MYV Holds a Black Friday Promotion in 2024","jungleon-office":"V Labs Selected to Join Seongnam Startup Center Jungle ON","onk-healthcare-launch":"Three Taijeon Group ONK Health Products Join the MYV Mall","jalpul-house-launch":"Household Essentials Brand Jalpul House Joins MYV","ozon-toothbrush-launch":"Korean Toothbrush Brand Ozon Joins MYV","verymom-launch":"Premium Skincare Brand Verymom Joins MYV","farmerssignature-lovew-launch":"Farmers Signature and Lovew Skincare Join MYV","onespapa-foot-cleanser-launch":"OnesPapa Natural Dog Paw Cleanser Joins MYV","ai-demand-patent":"V Labs Registers Patent for AI-Based Demand Forecasting","taejeon-vitality-launch":"MYV Adds Three Taijeon Group Wellness Products","manticket-launch":"Men's Care Brand Manticket Expands MYV's Portfolio","vastly-launch":"Eco-Friendly Lifestyle Brand Vastly Joins MYV","cuni-launch":"Natural Lifestyle Brand CUNI Joins the MYV Mall","cleanbeauty-startup-seminar":"V Labs Participates in Clean Beauty Startup Seminar","gibunjoeum-launch":"Upcycled Hand Wash Brand Gibunjoeum Joins MYV"};
  const summaryTranslations = {"마이브이 홈":"MYV homepage","마이브이 상단으로 이동":"Back to top","(주)브이랩스":"V Labs Inc.","쇼핑, 마이브이":"MYV, made for you","소비자와 좋은 브랜드를 연결하고,":"Connecting people with great brands,","마이브이 알아보기":"Discover MYV","소비와 브랜드의 성장을":"Connecting people and brands","마이브이는 소비자의 참여와 검증된 브랜드를 연결해 함께 성장하는 가치소비 생태계를 만들어갑니다.":"MYV connects consumer participation with carefully selected brands to create a commerce ecosystem where everyone can grow.","마이브이와 함께":"Grow with MYV","좋은 제품을 경험하고, 나의 영향력을 가치와 수익으로 연결하는 참여형 커머스":"Turn authentic product experiences and your influence into meaningful opportunities.","경쟁력 있는 브랜드와 제품을 더 많은 소비자에게 연결하는 새로운 성장 기회":"Connect promising brands and products with more consumers and new opportunities.","마이브이 소식":"MYV News","브이랩스 이장욱 대표, 중소기업과 소비자가 함께 성장하는 이커머스 구조를 만들다":"V Labs CEO Jangwook Lee on E-Commerce Where Businesses and Consumers Grow Together","한국인플루언서이커머스협회-브이랩스, 함께 ‘MyV 프로슈머 인플루언서’ 시대 연다… 글로벌 상생 생태계 구축":"Influencer E-Commerce Association and V Labs Join Forces for a Global MYV Prosumer Ecosystem","마이브이와 함께하세요.":"Grow with MYV.","마이브이는 소비가 개인의 만족으로 끝나지 않고 새로운 가치와 소득으로 이어지도록 설계된 플랫폼입니다. 검증된 K-스타트업 브랜드와 소비자를 연결하고, 국내에서 검증된 성과를 글로벌 시장으로 확장합니다.":"MYV is designed to turn everyday purchases into meaningful value and new opportunities. We bring together consumers and promising Korean brands, helping proven ideas expand internationally.","소비자와 유망기업이 동반 성장하고, 검증된 K-브랜드가 더 넓은 시장으로 나아갈 수 있도록 연결합니다.":"We connect consumers and emerging brands so they can grow together and reach new markets.","마이브이를 움직이는 4가지 가치":"The four values that drive MYV","제품과 소비가 가진 본질적인 가치를 봅니다.":"We focus on the genuine value of products and purchases.","검증된 기업과 제품으로 신뢰를 쌓습니다.":"We build trust through carefully selected brands and products.","국내 프로슈머 생태계와 K-브랜드 글로벌 확장을 하나의 선순환 구조로 연결합니다.":"We connect a domestic prosumer ecosystem with international growth opportunities for Korean brands.","소비자의 활동과 구매 데이터를 기반으로 파트너 브랜드의 성장을 만들고, 혜택과 보상을 다시 소비자에게 환원합니다.":"We connect consumer engagement and purchasing insights with partner-brand growth while creating opportunities for members.","K-브랜드 확장":"K-Brand Expansion","국내에서 검증된 파트너와 제품을 글로벌 프로슈머, 해외 결제, 현지 채널과 연결해 저위험 글로벌 확장을 추진합니다.":"We aim to connect promising Korean brands with global prosumers, local channels and cross-border commerce.","마이브이 프로슈머는 단순 판매자가 아니라 좋은 제품을 직접 경험하고, 신뢰를 바탕으로 브랜드와 소비자를 연결하는 가치의 큐레이터입니다.":"MYV prosumers are more than sellers. They experience products firsthand and connect brands with consumers through trust.","제품을 찾고, 협상하고, 판매하고, CS까지 직접 처리하는 구조에서 벗어나 콘텐츠와 관계에 더 집중할 수 있도록 설계합니다.":"Step away from repeatedly sourcing products, negotiating, selling and managing inquiries to focus on content and relationships.","매주 새로운 제품 소싱, 업체 미팅, 가격 협상까지 반복되는 노동 집약적 구조.":"Constant product searches, supplier meetings and price negotiations take up valuable time.","검증되지 않은 제품의 무분별한 홍보는 장기적으로 계정의 영향력과 신뢰를 떨어뜨릴 수 있습니다.":"Promoting unverified products indiscriminately can undermine long-term audience trust.","좋은 제품만 엄선해 직접 체험하고 솔직한 경험을 팔로워와 나눕니다.":"Try carefully selected products and share your honest experiences.","제품 선정부터 운영, 정산, 네트워크 성장까지 마이브이가 활동 전반을 연결합니다.":"MYV connects product selection, operations, settlement and network growth.","엄선된 제품 큐레이션":"Curated products","전문 MD가 검증한 프리미엄 제품군을 제안해 제품 탐색 부담을 줄입니다.":"Access curated product options to reduce the time spent sourcing independently.","본인의 전용 링크를 통해 제품이 판매될 때 발생하는 판매 수수료입니다.":"Commission earned when eligible products are sold through your dedicated link.","한 번 연결된 신규 가입 팔로워가 이후 다른 제품을 구매할 때 발생하는 수익 구조입니다.":"Rewards associated with eligible purchases by followers connected to your account.","마이브이 프로슈머":"MYV Prosumer","제품 관리":"Product sourcing","제품별 검증 부담":"Independent product verification","검증된 제품 중심 제안":"Focus on curated products","신뢰가 곧 자산이니까, 제품은 더 까다롭게":"Careful curation builds lasting trust","건강식품, 기능성 화장품, 친환경 생활용품 등 지속적인 구매 가능성이 있는 상품을 중심으로 단계별 검토를 거칩니다.":"We review products for everyday needs, from wellness and skincare to sustainable essentials.","제품 발굴":"Product discovery","제품 이미지, 숏폼 영상, 상세페이지 등 활용 가능한 크리에이티브 소재를 제공합니다.":"Access product visuals, short-form video assets and product page materials.","제품 판매와 구매자 성향을 바탕으로 활동 전략을 세울 수 있도록 돕습니다.":"Learn from product sales and customer engagement trends.","제품 카탈로그 및 샘플 확인":"Review products and samples","제품 추천 콘텐츠 게시":"Publish product recommendations","좋은 제품이":"Helping great products","제품은 좋은데,":"Have a great product","좋은 제품이어도 대형 브랜드 사이에서 소비자에게 발견되기 어렵습니다.":"Even excellent products can be overlooked in a crowded market.","검증된 제품만을 위한":"A thoughtful process","시장과 소비자 니즈를 바탕으로 잠재력 있는 제품을 탐색합니다.":"Identify promising products based on market demand and consumer needs.","성분, 제조사, 인증과 제품 경쟁력을 확인합니다.":"Review ingredients, manufacturing, certifications and product quality.","V.Point는 사이트 내 제품 구매 시 현금처럼 사용할 수 있는 포인트로, 나의 소비와 팔로워 소비를 통해 적립됩니다.":"V.Point is a shopping reward point that can be earned through qualifying purchases and referral activity, subject to program rules.","* 제품별 V.Point 적립금액은 상이할 수 있습니다.":"* V.Point earning rates may vary by product.","사이트 내 제품 구매 시 현금처럼 사용 가능한 포인트를 말합니다.":"Points that may be used for qualifying purchases in the MYV shopping platform.","마이브이를 추천하고 소개하는 사람을 말하며 멘토는 ID 당 한명만 등록 가능합니다.":"A mentor introduces MYV to new participants. The Korean program permits one registered mentor per account.","V.Point는 입금 수수료 500원 공제 후 제공되며 제품별 적립률이 상이할 수 있습니다.":"The Korean terms describe a KRW 500 transfer fee and different earning rates by product.","V.Point는 마이브이의 소비와 추천 활동을 가치소득으로 연결하는 포인트 구조입니다.":"V.Point connects qualifying purchases and referrals with shopping rewards.","마이브이, 프로슈머, 입점 및 파트너십에 대한 문의를 남겨주세요.":"Get in touch about MYV, the prosumer program, brand partnerships and more.","회사 / 브랜드명":"Company / Brand","마이브이 웹사이트의 개인정보 처리 기준을 안내합니다. 현재 사이트는 리뉴얼 구축 단계이며, 실제 서비스 기능과 수집 항목 확정 시 최종 정책으로 업데이트됩니다.":"This page outlines the draft privacy practices of the MYV website during its renewal. The final policy will be updated when service functions and data requirements are confirmed.","(주)브이랩스는 서비스 문의 대응, 파트너 및 프로슈머 상담, 서비스 운영에 필요한 범위에서 개인정보를 처리할 수 있습니다.":"V Labs Inc. may process personal information as needed to respond to inquiries, discuss partnerships and prosumer programs, and operate the service.","마이브이의 새로운 소식과 파트너십, 글로벌 활동을 전합니다.":"News from MYV, including partnerships and global activities.","“소비가 곧 가치” 브이랩스 이장욱 대표, 2025 한국을 빛낸 인플루언서 어워즈 ‘기업 소비자 큐레이션 기업 부문’ 대상 수상":"V Labs CEO Receives Award for Consumer Curation at the 2025 Influencer Awards","“소비가 곧 가치가 되는 플랫폼” 이장욱 대표, 마이브이(MyV)로 열어가는 상생의 이커머스":"MYV: Building an E-Commerce Model Where Consumption Creates Value","마이브이, 저자극 더마 코스메틱 ‘닥터젠틀’ 공식 입점":"Gentle Dermocosmetics Brand Dr. Gentle Joins MYV","마이브이, 반려견 브랜드 ‘완스파파’ 간식 신제품 입점… 발 세정제에 이어 라인업 확장":"Pet Brand OnesPapa Expands on MYV with Freeze-Dried Dog Treats","마이브이, ‘자연 방목 국내산 토종 흑염소진액’·‘케이 레드 진생 프리미엄 홍삼 스틱 선물세트’ 입점":"MYV Welcomes Traditional Korean Black Goat Extract and Premium Red Ginseng Gift Sets","마이브이, 프리미엄 두유 브랜드 ‘두유본색’ 공식 입점":"Premium Soy Milk Brand Duyubonsaek Joins MYV","소비가 곧 가치가 되는 플랫폼, 마이브이":"MYV: A Platform Where Consumption Becomes Shared Value","이장욱 브이랩스 대표, 위클리피플 인터뷰":"V Labs CEO Jangwook Lee Featured in Weekly People Interview","브이랩스, 마이브이 관련 특허 3건 등록":"V Labs Announces Three Patents Related to MYV","브이랩스, 기업·소비자가 상생하는 가치 소비 플랫폼 MyV 개발로 ‘지속 성장 도모’":"V Labs Develops MYV, a Value-Driven Commerce Platform for Shared Growth","브이랩스, 소비자 참여형 이커머스 플랫폼 ‘MyV’ 홈페이지 전면 리뉴얼 오픈 기념 이벤트":"MYV Marks Its 2024 Online Mall Renewal with a Launch Event","마이브이에 친구 초대하고 최대 1만P 받으세요… 마이브이, V.Point 이벤트 진행":"MYV Announces 2024 Invite-a-Friend V.Point Campaign","브이랩스, 피트니스 미디어 광고 플랫폼 어시스트핏 통해 소비자에게 한 발짝 더":"V Labs Broadens Consumer Engagement with AssistFit Media","브이랩스, 루루안 ‘무전원 친환경 휴대용 비데’ 마이브이 입점":"Eco-Friendly Portable Bidet Brand Luluan Joins MYV","브이랩스, 뷰티&헬스케어 전문 브랜드 ‘펄케어’ 마이브이 온라인몰 입점":"Beauty and Healthcare Brand Pearlcare Joins MYV","마이브이, 블랙프라이데이 최대 65% 할인 진행":"MYV Holds a Black Friday Promotion in 2024","브이랩스, 성남창업센터 킨스타워 정글ON에 입주 예정":"V Labs Selected to Join Seongnam Startup Center Jungle ON","브이랩스, 태전그룹 오엔케이 건강기능식품 3종 마이브이 온라인몰 입점":"Three Taijeon Group ONK Health Products Join the MYV Mall","브이랩스, 마이브이 자사몰에 종합위생용품 전문기업 미래생활 ‘잘풀리는집’ 입점":"Household Essentials Brand Jalpul House Joins MYV","브이랩스, 마이브이 자사몰에 국내 기능성 칫솔 전문 브랜드 오죤 입점":"Korean Toothbrush Brand Ozon Joins MYV","브이랩스, 프리미엄 스킨케어 브랜드 '베리맘' 마이브이(myV) 입점":"Premium Skincare Brand Verymom Joins MYV","브이랩스, 아멍코스메틱의 파머스시그니처, 러뷰 마이브이(MyV) 입점":"Farmers Signature and Lovew Skincare Join MYV","브이랩스, 천연 강아지 발세정제 완스파파 마이브이 입점":"OnesPapa Natural Dog Paw Cleanser Joins MYV","브이랩스, AI 기반 수요 예측 기술 특허 등록":"V Labs Registers Patent for AI-Based Demand Forecasting","마이브이몰, 태전그룹 건강기능식품 3종 추가 입점":"MYV Adds Three Taijeon Group Wellness Products","마이브이, 남성케어 브랜드 ‘맨티켓’ 입점으로 라인업 확대":"Men's Care Brand Manticket Expands MYV's Portfolio","친환경 라이프 브랜드 바스틀리 마이브이 자사몰 공식 입점":"Eco-Friendly Lifestyle Brand Vastly Joins MYV","자연에서 온 건강한 선택, '쿠니(CUNI)' 마이브이몰 공식 입점":"Natural Lifestyle Brand CUNI Joins the MYV Mall","브이랩스, 화장품 창업자 위한 ‘클린뷰티 스타트업 세미나+네트워킹' 행사 참가":"V Labs Participates in Clean Beauty Startup Seminar","업사이클링 핸드워시 브랜드 기분좋음, 마이브이몰 입점 소식":"Upcycled Hand Wash Brand Gibunjoeum Joins MYV","완스파파가 기존 발 세정제에 이어 후코이단 동결건조 강아지 간식 후코잇 트릿을 선보이며 마이브이의 반려동물 제품 라인업을 넓혔습니다.":"OnesPapa expands its pet-care lineup on MYV with freeze-dried dog treats alongside its existing paw cleanser.","자연 방목 국내산 토종 흑염소진액과 케이 레드 진생 프리미엄 홍삼 스틱 선물세트가 마이브이에 입점했습니다.":"Korean black goat extract and premium red ginseng gift sets are now available through MYV.","프리미엄 두유 브랜드 두유본색이 마이브이에 입점했습니다. 국산콩과 단호박·자색고구마·흑임자 등 원물의 풍미를 담은 무가당 아침두유를 소개합니다.":"Premium soy milk brand Duyubonsaek joins MYV with unsweetened drinks featuring Korean ingredients.","마이브이의 입점 기준, 지속가능한 비즈니스, 브이슈머와 V.Point 리워드, 친환경 브랜드 협업을 통해 가치 소비와 상생의 철학을 소개합니다.":"An introduction to MYV's brand selection, V.Point rewards and approach to collaborative, value-driven commerce.","이장욱 브이랩스 대표가 위클리피플 인터뷰를 통해 마이브이의 탄생 배경과 가치소비, 동반 성장의 철학을 소개했습니다.":"V Labs CEO Jangwook Lee discusses the origins of MYV and the philosophy of shared growth.","브이랩스가 마이브이의 소비자 참여와 가치 공유 구조에 적용한 시스템의 특허 등록 소식을 전했습니다.":"V Labs shares news of patent registrations related to consumer participation and value sharing at MYV.","기업과 소비자가 함께 성장하는 소비자 참여형 플랫폼 마이브이의 사업 철학과 서비스 구조를 소개합니다.":"Explore MYV's vision and service model for a commerce platform built around shared growth.","2024년 마이브이 쇼핑몰 리뉴얼을 통해 간편 회원가입과 V.Point 환급 신청 방식 등 이용 편의를 개선했습니다.":"MYV's 2024 online mall renewal enhanced registration and V.Point redemption accessibility.","2024년 마이브이 친구 초대 이벤트의 참여 방식과 V.Point 혜택을 소개한 소식입니다.":"A look back at MYV's 2024 referral campaign and V.Point incentives.","브이랩스가 어시스트핏과 함께 피트니스센터 미디어 광고와 제품 체험을 통해 소비자 접점을 넓혔습니다.":"V Labs expands consumer outreach through a partnership with AssistFit media.","무전원 친환경 휴대용 비데 브랜드 루루안의 마이브이 입점 소식을 소개합니다.":"Eco-friendly portable bidet brand Luluan joins MYV.","뷰티·헬스케어 브랜드 펄케어의 뉴소닉, 화이트진 PRO, 전동 헤어 브러쉬 등 뷰티 디바이스 3종이 마이브이에 입점했습니다.":"Pearlcare adds three beauty and wellness devices to the MYV catalog.","2024년 11월 20일부터 12월 8일까지 진행한 마이브이 블랙프라이데이 프로모션 소식입니다. 뷰티 디바이스와 건강기능식품 등을 할인 판매했습니다.":"Highlights from the MYV Black Friday promotion held in late 2024.","브이랩스가 성남창업센터 킨스타워 정글ON 입주기업으로 선정돼 2025년 1월 입주 계획을 발표했습니다.":"V Labs is selected to join the Seongnam Startup Center's Jungle ON program.","태전그룹 오엔케이의 메멘토플러스, 다시 피오니, 맨파워 쏘팔메토 옥타코사놀 등 건강기능식품 3종이 마이브이에 추가 입점했습니다.":"Three ONK wellness products from Taijeon Group join MYV.","미래생활의 잘풀리는집이 마이브이에 입점했습니다. 롤화장지, 키친타월, 미용티슈, 물티슈 등 생활용품 4종을 소개합니다.":"Household essentials brand Jalpul House joins MYV with a range of everyday products.","국내 칫솔 브랜드 오죤의 컴팩트미세모, 와이드미세모, 롱미세모 칫솔 3종이 마이브이에 입점했습니다.":"Korean toothbrush brand Ozon joins MYV with three brush varieties.","프리미엄 스킨케어 브랜드 베리맘이 마이브이에 입점하며 씨드 세라마이드 라인 등 스킨케어 제품 11종을 선보입니다.":"Premium skincare brand Verymom joins MYV with a range of ceramide-based products.","아멍코스메틱의 파머스시그니처와 러뷰가 마이브이에 입점했습니다. 두 브랜드의 스킨케어 제품과 브랜드 철학을 소개합니다.":"Farmers Signature and Lovew skincare brands become MYV partners.","반려동물 케어 브랜드 완스파파의 순비누 풋 클렌저가 마이브이에 입점했습니다. 브랜드와 제품 개발 이야기를 소개합니다.":"OnesPapa introduces its natural pet paw cleanser to MYV.","브이랩스가 AI 기반 수요 예측을 통해 쇼핑몰 입점 제품을 추천하는 방법 및 장치에 대한 특허 등록 소식을 발표했습니다.":"V Labs announces a patent registration covering AI-driven product demand forecasting.","태전그룹의 지금부터 밸런스 비타민B, 지금부터 코큐텐, 지금부터 활력충전 등 건강기능식품 3종이 마이브이에 추가 입점했습니다.":"Three additional Taijeon Group wellness products join MYV.","남성 케어 브랜드 맨티켓이 마이브이에 입점했습니다. 남성 청결제 인티미트 워시와 스칼프 케어 샴푸를 소개합니다.":"Men's care brand Manticket joins MYV with cleansing and scalp-care products.","친환경 라이프 브랜드 바스틀리가 마이브이에 입점했습니다. 밀짚을 원료로 한 화장지, 키친타월, 미용티슈, 리빙티슈 4종을 소개합니다.":"Eco-friendly lifestyle brand Vastly joins MYV with everyday paper products.","자연 유래 원료를 사용하는 생활용품 브랜드 쿠니의 칫솔, 치약, 샴푸 3종이 마이브이에 입점했습니다.":"Natural lifestyle brand CUNI joins MYV with oral-care and hair-care products.","브이랩스가 2025년 7월 18일 코엑스에서 열린 클린뷰티 스타트업 세미나에 참여했습니다. 이장욱 대표는 마이브이의 보상형 커머스 사업 모델을 소개했습니다.":"V Labs shares MYV's rewards-driven commerce concept at a clean beauty startup event.","화장품 원부자재를 업사이클링하는 브랜드 기분좋음이 마이브이에 입점했습니다. 핸드워시와 브랜드의 환경·나눔 철학을 소개합니다.":"Upcycled hand wash brand Gibunjoeum joins MYV with a focus on responsible consumption.","제품 구매와 V.Point 적립을 연결하는 마이브이 쇼핑":"MYV shopping with V.Point rewards","제품 경험을 콘텐츠와 추천으로 공유하는 프로슈머":"Prosumers sharing experiences through content","기존 제휴 마케팅과 마이브이 프로슈머 비교표":"Comparison of affiliate marketing and MYV prosumer program","좋은 브랜드 제품을 더 많은 소비자에게 연결하는 커머스":"Connecting promising brands with more consumers","마이브이 구매로 쌓이는 V.Point":"V.Point rewards from MYV purchases","회사 또는 브랜드명을 입력해주세요.":"Enter your company or brand.","마이브이 홈페이지":"MYV Website","검증된 제품만을":"Carefully curated products"};
  const archive = document.querySelector('[data-news-archive]');
  if (!archive) return;

  const grid = archive.querySelector('.news-data-grid');
  const hero = document.querySelector('.page-hero');
  const cards = Array.from(grid.querySelectorAll('.news-data-card'));
  const buttons = Array.from(archive.querySelectorAll('[data-filter]'));
  const pagination = archive.querySelector('.news-pagination');
  const summary = archive.querySelector('#newsResults');
  const originalTitle = document.title;
  const pageSize = 12;
  let category = 'ALL';
  let page = 1;
  let listingScroll = 0;
  let routeVersion = 0;
  let postPromise;

  // Every news item has its own shareable address, on this SAME page.
  cards.forEach((card) => {
    card.href = './news.html?article=' + encodeURIComponent(card.dataset.postId);
    card.removeAttribute('target');
    card.removeAttribute('rel');
    const action = card.querySelector('.news-data-meta span');
    if (action) action.textContent = 'Read article →';
  });
  cards.sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''));
  cards.forEach((card) => grid.appendChild(card));

  const detail = document.createElement('section');
  detail.className = 'news-detail-section';
  detail.setAttribute('data-news-detail', '');
  detail.hidden = true;
  detail.innerHTML =
    '<div class="container"><article class="article-shell">' +
    '<a class="article-back" href="./news.html">← Back to News</a>' +
    '<header class="article-heading"><span class="article-category"></span>' +
    '<h1 id="newsArticleTitle"></h1><div class="article-meta"></div></header>' +
    '<p class="article-lead" id="newsArticleLead"></p>' +
    '<div class="article-content" id="newsArticleContent"></div>' +
    '<div class="article-bottom"><a href="./news.html">Back to News</a></div>' +
    '</article></div>';
  archive.insertAdjacentElement('afterend', detail);
  const heading = detail.querySelector('#newsArticleTitle');
  const categoryEl = detail.querySelector('.article-category');
  const lead = detail.querySelector('#newsArticleLead');
  const content = detail.querySelector('#newsArticleContent');
  const meta = detail.querySelector('.article-meta');

  const knownHeadings = new Set([
    '상생 이커머스 플랫폼 ‘마이브이’',
    '가치 소비를 통해 풍요로운 세상을 꿈꾸다',
    '사칙 연산으로 소개하는 ‘마이브이(MyV)’',
    '소비자가 수익을 얻는 가치 소비',
    '마이브이에서만 가능한 특별한 만남',
    '순기능 비즈니스 모델, 상생을 추구하는 마이브이',
    '브이랩스 개요', '브이랩스 소개', '강점', 'profile', '유투브 영상',
    '[마이브이의 지속가능한 철학]', '[함께 나누는 상생 구조]',
    '[친환경 브랜드와의 협업]', '꼼꼼한 입점 기준',
    '지속가능 특허 비즈니스', '브이슈머(V‑sumer)', 'V.Point 리워드'
  ]);

  function element(tag, className, textValue) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textValue !== undefined) node.textContent = textValue;
    return node;
  }

  function addRichText(node, textValue) {
    const source = String(textValue || '');
    const pattern = /(\*\*[^*\n]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<>()]+)/g;
    let last = 0;
    for (const match of source.matchAll(pattern)) {
      node.appendChild(document.createTextNode(source.slice(last, match.index)));
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        node.appendChild(element('strong', '', token.slice(2, -2)));
      } else {
        const markdown = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
        const url = markdown ? markdown[2] : token;
        try {
          const parsed = new URL(url);
          if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('Unsafe link');
          const link = element('a', '', markdown ? markdown[1] : token);
          link.href = parsed.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          node.appendChild(link);
        } catch {
          node.appendChild(document.createTextNode(token));
        }
      }
      last = match.index + token.length;
    }
    node.appendChild(document.createTextNode(source.slice(last)));
  }

  function renderBody(post) {
    content.replaceChildren();
    if (!post.body) {
      content.appendChild(element('p', 'article-empty', 'Article content is being prepared.'));
      return;
    }
    if (post.intro) content.appendChild(element('p', '', post.intro));
    let imageNumber = 0;
    const paragraphs = String(post.body).split(/\n\s*\n/);
    paragraphs.forEach((item) => {
      const paragraph = item.trim();
      if (!paragraph) return;
      // Imported source material can contain an extra quote before an image URL.
      const normalized = paragraph.replace(/^["'](?=https?:\/\/)/, '').replace(/["']$/, '');
      if (/^https?:\/\/\S+\.(?:webp|png|jpe?g)(?:\?\S*)?$/i.test(normalized)) {
        const figure = element('figure');
        const picture = element('img');
        picture.src = normalized;
        picture.alt = post.title + ' — 자료 이미지 ' + (++imageNumber);
        picture.loading = 'lazy';
        picture.decoding = 'async';
        figure.appendChild(picture);
        content.appendChild(figure);
        return;
      }
      if (knownHeadings.has(paragraph) || paragraph === '제품 보러 가기') {
        const title = paragraph === 'profile' ? '대표 프로필' :
          paragraph === '유투브 영상' ? '관련 영상' :
          paragraph === '제품 보러 가기' ? '제품 살펴보기' : paragraph;
        content.appendChild(element('h2', '', title));
        return;
      }
      if (paragraph.includes('https://') || paragraph.includes('http://')) {
        const group = element('div', 'article-links');
        addRichText(group, paragraph);
        content.appendChild(group);
        return;
      }
      if (paragraph.startsWith('“') && paragraph.endsWith('”')) {
        const quote = element('blockquote');
        const p = element('p');
        addRichText(p, paragraph);
        quote.appendChild(p);
        content.appendChild(quote);
        return;
      }
      const p = element('p');
      addRichText(p, paragraph);
      content.appendChild(p);
    });
  }

  function loadPosts() {
    if (!postPromise) {
      postPromise = fetch('../news-posts.json?v=20261018-parity01', {cache: 'no-store'})
        .then((response) => {
          if (!response.ok) throw new Error('Article data could not be loaded');
          return response.json();
        });
    }
    return postPromise;
  }

  function readListState() {
    const params = new URLSearchParams(location.search);
    const requested = params.get('category');
    category = buttons.some((button) => button.dataset.filter === requested) ? requested : 'ALL';
    page = Math.max(1, Number.parseInt(params.get('page'), 10) || 1);
  }

  function renderList(moveFocus = false) {
    const filtered = cards.filter((card) => category === 'ALL' || card.dataset.category === category);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(page, totalPages);
    const visible = new Set(filtered.slice((page - 1) * pageSize, page * pageSize));
    cards.forEach((card) => { card.hidden = !visible.has(card); });
    buttons.forEach((button) => {
      const active = button.dataset.filter === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    summary.textContent = (category === 'ALL' ? 'ALL' : category) + ' ' +
      filtered.length.toLocaleString('ko-KR') + ' articles · newest first · ' + page + ' / ' + totalPages + ' pages';

    pagination.replaceChildren();
    function addPageButton(label, target, disabled, current = false) {
      const button = element('button', '', label);
      button.type = 'button';
      button.disabled = disabled;
      if (current) button.setAttribute('aria-current', 'page');
      if (/^\d+$/.test(label)) button.setAttribute('aria-label', label + '페이지');
      button.addEventListener('click', () => {
        page = target;
        renderList(true);
      });
      pagination.appendChild(button);
    }
    if (totalPages > 1) {
      addPageButton('Previous', page - 1, page === 1);
      for (let p = 1; p <= totalPages; p++) addPageButton(String(p), p, false, p === page);
      addPageButton('Next', page + 1, page === totalPages);
    }

    const url = new URL(location.href);
    url.searchParams.delete('article');
    if (category === 'ALL') url.searchParams.delete('category');
    else url.searchParams.set('category', category);
    if (page === 1) url.searchParams.delete('page');
    else url.searchParams.set('page', String(page));
    history.replaceState(history.state, '', url);

    if (moveFocus) {
      summary.focus({preventScroll: true});
      summary.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  }

  async function renderRoute(scrollToTop = false) {
    const serial = ++routeVersion;
    const id = new URLSearchParams(location.search).get('article');
    if (!id) {
      detail.hidden = true;
      archive.hidden = false;
      if (hero) hero.hidden = false;
      document.body.classList.remove('news-article-page');
      document.title = originalTitle;
      readListState();
      renderList();
      if (scrollToTop) window.scrollTo({top: listingScroll, behavior: 'instant'});
      return;
    }

    listingScroll = document.body.classList.contains('news-article-page')
      ? listingScroll : window.scrollY;
    archive.hidden = true;
    if (hero) hero.hidden = true;
    detail.hidden = false;
    document.body.classList.add('news-article-page');
    categoryEl.textContent = '';
    heading.textContent = '뉴스를 불러오는 중입니다.';
    lead.hidden = true;
    meta.replaceChildren();
    content.replaceChildren();
    if (scrollToTop) window.scrollTo({top: 0, behavior: 'instant'});

    try {
      const posts = await loadPosts();
      if (serial !== routeVersion) return;
      const post = posts.find((item) => item.id === id);
      if (!post) {
        heading.textContent = 'Article not found.';
        content.appendChild(element('p', '', 'Please select another article from the news list.'));
        return;
      }
      categoryEl.textContent = post.category || 'MYV';
      heading.textContent = newsTitles[post.id] || post.title;
      document.title = (newsTitles[post.id] || post.title) + ' | MYV NEWS';
      const dated = element('span', '', 'Published ' + post.date);
      meta.appendChild(dated);
      if (post.reportedDate) meta.appendChild(element('span', '', 'Original publication ' + post.reportedDate));
      lead.textContent = summaryTranslations[post.summary] || post.summary || '';
      lead.hidden = !post.summary;
      renderBody(post);
    } catch (error) {
      if (serial !== routeVersion) return;
      heading.textContent = 'Could not load the article.';
      content.appendChild(element('p', '', 'Please try again later.'));
      postPromise = null;
    }
  }

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.news-data-card');
    if (!card || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    listingScroll = window.scrollY;
    history.pushState({newsDetail: true}, '', card.href);
    renderRoute(true);
  });

  detail.querySelectorAll('.article-back, .article-bottom a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const url = new URL('./news.html', location.href);
      if (category !== 'ALL') url.searchParams.set('category', category);
      if (page > 1) url.searchParams.set('page', String(page));
      history.pushState(null, '', url);
      renderRoute(true);
    });
  });

  buttons.forEach((button) => button.addEventListener('click', () => {
    category = button.dataset.filter;
    page = 1;
    renderList();
  }));

  window.addEventListener('popstate', () => renderRoute(true));
  renderRoute();
})();
