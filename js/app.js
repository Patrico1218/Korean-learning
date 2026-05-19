const data = {
  vowels: [
    { char:'ㅏ', reading:'ㄚ (a)', hint:'嘴開大', example:'아 (啊)', type:'vowel' },
    { char:'ㅓ', reading:'ㄜ (eo)', hint:'嘴開中', example:'어 (嗯)', type:'vowel' },
    { char:'ㅗ', reading:'ㄛ (o)', hint:'嘴圓', example:'오 (五)', type:'vowel' },
    { char:'ㅜ', reading:'ㄨ (u)', hint:'嘴突出', example:'우 (牛)', type:'vowel' },
    { char:'ㅡ', reading:'ㄜ扁 (eu)', hint:'嘴扁平', example:'으 (嗯)', type:'vowel' },
    { char:'ㅣ', reading:'ㄧ (i)', hint:'嘴角拉', example:'이 (這)', type:'vowel' },
    { char:'ㅐ', reading:'ㄝ (ae)', hint:'≈ㅔ同音', example:'개 (狗)', type:'vowel' },
    { char:'ㅔ', reading:'ㄝ (e)', hint:'≈ㅐ同音', example:'네 (是)', type:'vowel' },
    { char:'ㅑ', reading:'ㄧㄚ (ya)', hint:'ㅏ+一撇', example:'야 (喂)', type:'vowel' },
    { char:'ㅕ', reading:'ㄧㄜ (yeo)', hint:'ㅓ+一撇', example:'여 (女)', type:'vowel' },
    { char:'ㅛ', reading:'ㄧㄛ (yo)', hint:'ㅗ+一撇', example:'요 (要)', type:'vowel' },
    { char:'ㅠ', reading:'ㄧㄨ (yu)', hint:'ㅜ+一撇', example:'유 (有)', type:'vowel' },
  ],
  plain: [
    { char:'ㄱ', reading:'ㄍ/k (g)', hint:'像英文G', example:'가다 (去)', type:'plain' },
    { char:'ㄴ', reading:'ㄋ (n)', hint:'=注音ㄴ', example:'나 (我)', type:'plain' },
    { char:'ㄷ', reading:'ㄉ/t (d)', hint:'ㄴ+一橫', example:'다 (都)', type:'plain' },
    { char:'ㄹ', reading:'ㄌ~ㄖ (r/l)', hint:'輕彈舌', example:'라면 (泡麵)', type:'plain' },
    { char:'ㅁ', reading:'ㄇ (m)', hint:'像嘴巴', example:'먹다 (吃)', type:'plain' },
    { char:'ㅂ', reading:'ㄅ/p (b)', hint:'像嘴唇', example:'밥 (飯)', type:'plain' },
    { char:'ㅅ', reading:'ㄙ (s)', hint:'像牙齒', example:'사랑 (愛)', type:'plain' },
    { char:'ㅇ', reading:'無音/ㄥng', hint:'圓圈', example:'아이 (孩子)', type:'plain' },
    { char:'ㅈ', reading:'ㄐ (j)', hint:'', example:'저 (我-敬)', type:'plain' },
    { char:'ㅎ', reading:'ㄏ (h)', hint:'', example:'한국 (韓國)', type:'plain' },
  ],
  asp: [
    { char:'ㅋ', reading:'ㄎ (k)', hint:'ㄱ送氣版', example:'커피 (咖啡)', type:'asp' },
    { char:'ㅌ', reading:'ㄊ (t)', hint:'ㄷ送氣版', example:'타다 (搭乘)', type:'asp' },
    { char:'ㅍ', reading:'ㄆ (p)', hint:'ㅂ送氣版', example:'편의점 (便利店)', type:'asp' },
    { char:'ㅊ', reading:'ㄑ (ch)', hint:'ㅈ送氣版', example:'처음 (初次)', type:'asp' },
  ],
  hard: [
    { char:'ㄲ', reading:'緊ㄱ (kk)', hint:'憋氣發ㄱ', example:'까다 (剝)', type:'hard' },
    { char:'ㄸ', reading:'緊ㄷ (tt)', hint:'憋氣發ㄷ', example:'딸 (女兒)', type:'hard' },
    { char:'ㅃ', reading:'緊ㅂ (pp)', hint:'憋氣發ㅂ', example:'빵 (麵包)', type:'hard' },
    { char:'ㅆ', reading:'緊ㅅ (ss)', hint:'憋氣發ㅅ', example:'씩씩 (勇敢)', type:'hard' },
    { char:'ㅉ', reading:'緊ㅈ (jj)', hint:'憋氣發ㅈ', example:'짜다 (鹹)', type:'hard' },
  ]
};

const allChars = [...data.vowels, ...data.plain, ...data.asp, ...data.hard];
const labelMap = { vowel:'母音', plain:'平音', asp:'激音', hard:'硬音' };
const favoriteStorageKey = 'korean-learning-favorites';
let favorites = loadFavorites();

function getKoreanExampleText(item) {
  return (item.example || item.char).split(' ')[0];
}

function getFlashSpeakText(item) {
  return item.romanize ? item.front : getKoreanExampleText(item);
}

function getQuizSpeakText() {
  if (!currentQ) return '';
  return quizMode === 'vocab' ? currentQ.korean : getKoreanExampleText(currentQ);
}

function speakKorean(text) {
  if (!text || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.82;

  const voices = window.speechSynthesis.getVoices();
  const koreanVoice = voices.find(voice => voice.lang === 'ko-KR') ||
    voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith('ko'));
  if (koreanVoice) utterance.voice = koreanVoice;

  window.speechSynthesis.speak(utterance);
}

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoriteStorageKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
  } catch (error) {
    // Ignore storage failures so the practice page still works.
  }
}

function alphaFavoriteItem(item) {
  return {
    id: `alpha-${item.type}-${item.char}`,
    char: item.char,
    title: item.reading,
    sub: `${labelMap[item.type]} · ${item.example}`,
  };
}

function nounFavoriteItem(item) {
  return {
    id: `noun-${item.cat}-${item.front}`,
    char: item.front,
    title: item.meaning,
    sub: `${item.cat} · ${item.romanize}`,
  };
}

function travelFavoriteItem(item) {
  return {
    id: `travel-${item.cat}-${item.korean}`,
    char: item.korean,
    title: item.meaning,
    sub: `${item.catLabel} · ${item.romanize}`,
  };
}

function favoriteFromFlashItem(item) {
  return item.romanize ? nounFavoriteItem(item) : alphaFavoriteItem(item);
}

function isFavorite(id) {
  return favorites.some(item => item.id === id);
}

function toggleFavorite(item) {
  const exists = isFavorite(item.id);
  favorites = exists ? favorites.filter(saved => saved.id !== item.id) : [item, ...favorites];
  saveFavorites();
  renderFavorites();
  syncFavoriteButtons();
}

function removeFavorite(id) {
  favorites = favorites.filter(item => item.id !== id);
  saveFavorites();
  renderFavorites();
  syncFavoriteButtons();
}

function clearFavorites() {
  favorites = [];
  saveFavorites();
  renderFavorites();
  syncFavoriteButtons();
}

function toggleFavoriteList() {
  document.getElementById('favorite-panel').classList.toggle('show');
}

function syncFavoriteButtons() {
  document.querySelectorAll('.favorite-btn[data-favorite-id]').forEach(btn => {
    const active = isFavorite(btn.dataset.favoriteId);
    btn.classList.toggle('active', active);
    btn.textContent = active ? '♥' : '♡';
    btn.setAttribute('aria-label', active ? '移除收藏' : '加入收藏');
  });
}

function renderFavorites() {
  const count = document.getElementById('favorite-count');
  const list = document.getElementById('favorite-list');
  if (!count || !list) return;

  count.textContent = favorites.length;
  list.innerHTML = '';

  if (favorites.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'favorite-empty';
    empty.textContent = '還沒有收藏，點字卡右上角的愛心加入。';
    list.appendChild(empty);
    return;
  }

  favorites.forEach(item => {
    const row = document.createElement('div');
    row.className = 'favorite-item';

    const char = document.createElement('div');
    char.className = 'favorite-item-char';
    char.textContent = item.char;

    const main = document.createElement('div');
    main.className = 'favorite-item-main';

    const title = document.createElement('div');
    title.className = 'favorite-item-title';
    title.textContent = item.title;

    const sub = document.createElement('div');
    sub.className = 'favorite-item-sub';
    sub.textContent = item.sub;

    const remove = document.createElement('button');
    remove.className = 'favorite-remove-btn';
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `移除 ${item.char}`);
    remove.onclick = () => removeFavorite(item.id);

    main.append(title, sub);
    row.append(char, main, remove);
    list.appendChild(row);
  });
}

function buildGrid(arr, gridId) {
  const grid = document.getElementById(gridId);
  arr.forEach(item => {
    const favoriteItem = alphaFavoriteItem(item);
    const card = document.createElement('div');
    card.className = 'char-card';
    card.innerHTML = `
      <button class="speak-btn" type="button" aria-label="播放發音">🔊</button>
      <button class="favorite-btn" type="button" data-favorite-id="${favoriteItem.id}" aria-label="加入收藏">♡</button>
      <span class="korean-char">${item.char}</span>
      <div class="char-hint">${item.hint || '點擊看發音'}</div>
      <div class="reveal">${item.reading}</div>
    `;
    card.querySelector('.speak-btn').onclick = event => {
      event.stopPropagation();
      speakKorean(getKoreanExampleText(item));
    };
    card.querySelector('.favorite-btn').onclick = event => {
      event.stopPropagation();
      toggleFavorite(favoriteItem);
    };
    card.onclick = () => card.classList.toggle('flipped');
    grid.appendChild(card);
  });
}

buildGrid(data.vowels, 'vowel-grid');
buildGrid(data.plain, 'plain-grid');
buildGrid(data.asp, 'asp-grid');
buildGrid(data.hard, 'hard-grid');

const nounDecks = {
  food: [
    { front:'밥', romanize:'bap', meaning:'米飯', cat:'飲食' },
    { front:'라면', romanize:'ra-myeon', meaning:'泡麵', cat:'飲食' },
    { front:'삼겹살', romanize:'sam-gyeop-sal', meaning:'五花肉', cat:'飲食' },
    { front:'치킨', romanize:'chi-kin', meaning:'炸雞', cat:'飲食' },
    { front:'김치', romanize:'gim-chi', meaning:'泡菜', cat:'飲食' },
    { front:'떡볶이', romanize:'tteok-bo-kki', meaning:'辣炒年糕', cat:'飲食' },
    { front:'순두부찌개', romanize:'sun-du-bu-jji-gae', meaning:'嫩豆腐鍋', cat:'飲食' },
    { front:'비빔밥', romanize:'bi-bim-bap', meaning:'拌飯', cat:'飲食' },
    { front:'냉면', romanize:'naeng-myeon', meaning:'冷麵', cat:'飲食' },
    { front:'소주', romanize:'so-ju', meaning:'燒酒', cat:'飲食' },
    { front:'맥주', romanize:'maek-ju', meaning:'啤酒', cat:'飲食' },
    { front:'물', romanize:'mul', meaning:'水', cat:'飲食' },
    { front:'커피', romanize:'keo-pi', meaning:'咖啡', cat:'飲食' },
    { front:'메뉴', romanize:'me-nyu', meaning:'菜單', cat:'飲食' },
    { front:'식당', romanize:'sik-dang', meaning:'餐廳', cat:'飲食' },
  ],
  place: [
    { front:'공항', romanize:'gong-hang', meaning:'機場', cat:'場所' },
    { front:'호텔', romanize:'ho-tel', meaning:'飯店', cat:'場所' },
    { front:'편의점', romanize:'pyeon-ui-jeom', meaning:'便利商店', cat:'場所' },
    { front:'시장', romanize:'si-jang', meaning:'市場', cat:'場所' },
    { front:'백화점', romanize:'bae-kwa-jeom', meaning:'百貨公司', cat:'場所' },
    { front:'병원', romanize:'byeong-won', meaning:'醫院', cat:'場所' },
    { front:'약국', romanize:'yak-guk', meaning:'藥局', cat:'場所' },
    { front:'화장실', romanize:'hwa-jang-sil', meaning:'廁所', cat:'場所' },
    { front:'출구', romanize:'chul-gu', meaning:'出口', cat:'場所' },
    { front:'입구', romanize:'ip-gu', meaning:'入口', cat:'場所' },
    { front:'해변', romanize:'hae-byeon', meaning:'海灘', cat:'場所' },
    { front:'산', romanize:'san', meaning:'山', cat:'場所' },
    { front:'공원', romanize:'gong-won', meaning:'公園', cat:'場所' },
    { front:'박물관', romanize:'bang-mul-gwan', meaning:'博物館', cat:'場所' },
    { front:'카페', romanize:'ka-pe', meaning:'咖啡廳', cat:'場所' },
  ],
  transport: [
    { front:'지하철', romanize:'ji-ha-cheol', meaning:'地鐵', cat:'交通' },
    { front:'버스', romanize:'beo-seu', meaning:'公車', cat:'交通' },
    { front:'택시', romanize:'taek-si', meaning:'計程車', cat:'交通' },
    { front:'기차', romanize:'gi-cha', meaning:'火車', cat:'交通' },
    { front:'비행기', romanize:'bi-haeng-gi', meaning:'飛機', cat:'交通' },
    { front:'역', romanize:'yeok', meaning:'車站', cat:'交通' },
    { front:'정류장', romanize:'jeong-nyu-jang', meaning:'公車站', cat:'交通' },
    { front:'표', romanize:'pyo', meaning:'票', cat:'交通' },
    { front:'왼쪽', romanize:'oen-jjok', meaning:'左邊', cat:'交通' },
    { front:'오른쪽', romanize:'o-reun-jjok', meaning:'右邊', cat:'交通' },
    { front:'앞', romanize:'ap', meaning:'前面', cat:'交通' },
    { front:'뒤', romanize:'dwi', meaning:'後面', cat:'交通' },
    { front:'지도', romanize:'ji-do', meaning:'地圖', cat:'交通' },
    { front:'길', romanize:'gil', meaning:'路', cat:'交通' },
  ],
  shopping: [
    { front:'가게', romanize:'ga-ge', meaning:'商店', cat:'購物' },
    { front:'가격', romanize:'ga-gyeok', meaning:'價格', cat:'購物' },
    { front:'할인', romanize:'ha-rin', meaning:'折扣', cat:'購物' },
    { front:'영수증', romanize:'yeong-su-jeung', meaning:'收據', cat:'購物' },
    { front:'카드', romanize:'ka-deu', meaning:'信用卡', cat:'購物' },
    { front:'현금', romanize:'hyeon-geum', meaning:'現金', cat:'購物' },
    { front:'사이즈', romanize:'sa-i-jeu', meaning:'尺寸', cat:'購物' },
    { front:'색깔', romanize:'saek-kkal', meaning:'顏色', cat:'購物' },
    { front:'옷', romanize:'ot', meaning:'衣服', cat:'購物' },
    { front:'신발', romanize:'sin-bal', meaning:'鞋子', cat:'購物' },
    { front:'가방', romanize:'ga-bang', meaning:'包包', cat:'購物' },
    { front:'화장품', romanize:'hwa-jang-pum', meaning:'化妝品', cat:'購物' },
    { front:'선물', romanize:'seon-mul', meaning:'禮物', cat:'購物' },
    { front:'면세점', romanize:'myeon-se-jeom', meaning:'免稅店', cat:'購物' },
  ],
  body: [
    { front:'머리', romanize:'meo-ri', meaning:'頭', cat:'身體' },
    { front:'눈', romanize:'nun', meaning:'眼睛', cat:'身體' },
    { front:'코', romanize:'ko', meaning:'鼻子', cat:'身體' },
    { front:'입', romanize:'ip', meaning:'嘴巴', cat:'身體' },
    { front:'귀', romanize:'gwi', meaning:'耳朵', cat:'身體' },
    { front:'손', romanize:'son', meaning:'手', cat:'身體' },
    { front:'발', romanize:'bal', meaning:'腳', cat:'身體' },
    { front:'배', romanize:'bae', meaning:'肚子', cat:'身體' },
    { front:'등', romanize:'deung', meaning:'背部', cat:'身體' },
    { front:'목', romanize:'mok', meaning:'脖子', cat:'身體' },
    { front:'팔', romanize:'pal', meaning:'手臂', cat:'身體' },
    { front:'다리', romanize:'da-ri', meaning:'腿', cat:'身體' },
  ],
  time: [
    { front:'오늘', romanize:'o-neul', meaning:'今天', cat:'時間' },
    { front:'내일', romanize:'nae-il', meaning:'明天', cat:'時間' },
    { front:'어제', romanize:'eo-je', meaning:'昨天', cat:'時間' },
    { front:'지금', romanize:'ji-geum', meaning:'現在', cat:'時間' },
    { front:'아침', romanize:'a-chim', meaning:'早上', cat:'時間' },
    { front:'점심', romanize:'jeom-sim', meaning:'中午', cat:'時間' },
    { front:'저녁', romanize:'jeo-nyeok', meaning:'晚上', cat:'時間' },
    { front:'주말', romanize:'ju-mal', meaning:'週末', cat:'時間' },
    { front:'월요일', romanize:'wo-ryo-il', meaning:'星期一', cat:'時間' },
    { front:'금요일', romanize:'geu-myo-il', meaning:'星期五', cat:'時間' },
    { front:'시간', romanize:'si-gan', meaning:'時間／小時', cat:'時間' },
    { front:'분', romanize:'bun', meaning:'分鐘', cat:'時間' },
  ],
};

const catColorMap = {
  '飲食':'cat-food', '場所':'cat-greet', '交通':'cat-transport',
  '購物':'cat-shop', '身體':'cat-body', '時間':'cat-hotel',
};

let fcIndex = 0;
let fcList = [...allChars];
let fcDeckType = 'alpha';

function setFcDeck(deckKey, button) {
  fcDeckType = deckKey;
  document.querySelectorAll('.fc-deck-btn').forEach(b => b.classList.remove('active'));
  button.classList.add('active');

  if (deckKey === 'alpha') {
    fcList = [...allChars];
  } else if (deckKey === 'vowel') {
    fcList = [...data.vowels];
  } else if (deckKey === 'consonant') {
    fcList = [...data.plain, ...data.asp, ...data.hard];
  } else {
    fcList = [...(nounDecks[deckKey] || [])];
  }
  fcIndex = 0;
  updateFlashcard();
}

function updateFlashcard() {
  const card = document.getElementById('flashcard');
  card.classList.remove('flipped');
  setTimeout(() => {
    const item = fcList[fcIndex];
    const isNoun = !!item.romanize;

    document.getElementById('fc-char').textContent = item.front || item.char;
    document.getElementById('fc-front-hint').textContent = isNoun ? '點擊看中文意思' : '點擊翻牌看發音';
    document.getElementById('fc-counter').textContent = `${fcIndex + 1} / ${fcList.length}`;

    const back = document.getElementById('fc-back');
    if (isNoun) {
      back.innerHTML = `
        <span class="noun-korean">${item.front}</span>
        <span class="noun-romanize">${item.romanize}</span>
        <span class="reading" style="font-size:28px;margin:6px 0">${item.meaning}</span>
        <span class="vocab-cat-badge ${catColorMap[item.cat] || 'cat-greet'}">${item.cat}</span>
      `;
    } else {
      back.innerHTML = `
        <span class="reading">${item.reading}</span>
        <span class="meaning">${labelMap[item.type]}</span>
        <span class="example">${item.example}</span>
      `;
    }
    updateFlashFavoriteButton();
  }, 150);
}

function flipCard() { document.getElementById('flashcard').classList.toggle('flipped'); }
function updateFlashFavoriteButton() {
  const btn = document.getElementById('fc-favorite-btn');
  const item = favoriteFromFlashItem(fcList[fcIndex]);
  btn.dataset.favoriteId = item.id;
  syncFavoriteButtons();
}

function toggleCurrentFlashFavorite(event) {
  event.stopPropagation();
  toggleFavorite(favoriteFromFlashItem(fcList[fcIndex]));
}

function speakCurrentFlashCard(event) {
  event.stopPropagation();
  speakKorean(getFlashSpeakText(fcList[fcIndex]));
}

function updateQuizFavoriteButton() {
  const btn = document.getElementById('quiz-favorite-btn');
  if (!btn) return;

  if (quizMode !== 'vocab' || !currentQ) {
    btn.classList.remove('show');
    delete btn.dataset.favoriteId;
    return;
  }

  const item = travelFavoriteItem(currentQ);
  btn.dataset.favoriteId = item.id;
  btn.classList.add('show');
  syncFavoriteButtons();
}

function toggleCurrentQuizFavorite(event) {
  event.stopPropagation();
  if (quizMode !== 'vocab' || !currentQ) return;
  toggleFavorite(travelFavoriteItem(currentQ));
}

function updateQuizSpeakButton() {
  const btn = document.getElementById('quiz-speak-btn');
  if (!btn) return;
  btn.classList.toggle('show', !!currentQ);
}

function speakCurrentQuizQuestion(event) {
  event.stopPropagation();
  speakKorean(getQuizSpeakText());
}

function fcNext() { fcIndex = (fcIndex + 1) % fcList.length; updateFlashcard(); }
function fcPrev() { fcIndex = (fcIndex - 1 + fcList.length) % fcList.length; updateFlashcard(); }
function fcShuffle() {
  fcList = [...fcList].sort(() => Math.random() - 0.5);
  fcIndex = 0;
  updateFlashcard();
}

updateFlashcard();
renderFavorites();
syncFavoriteButtons();

let quizScore = 0;
let quizTotal = 0;
let quizQueue = [];
let currentQ = null;
let answered = false;
let quizMode = 'alpha';

const travelVocab = [
  { korean:'안녕하세요', romanize:'an-nyeong-ha-se-yo', meaning:'你好（敬語）', wrong:['謝謝', '對不起', '再見'], cat:'greet', catLabel:'問候' },
  { korean:'감사합니다', romanize:'gam-sa-ham-ni-da', meaning:'謝謝（正式）', wrong:['你好', '沒關係', '請問'], cat:'greet', catLabel:'問候' },
  { korean:'죄송합니다', romanize:'joe-song-ham-ni-da', meaning:'非常抱歉', wrong:['謝謝', '你好', '再見'], cat:'greet', catLabel:'問候' },
  { korean:'괜찮아요', romanize:'gwaen-cha-na-yo', meaning:'沒關係／還好', wrong:['我不懂', '請再說', '多少錢'], cat:'greet', catLabel:'問候' },
  { korean:'안녕히 가세요', romanize:'an-nyeong-hi ga-se-yo', meaning:'再見（送別人）', wrong:['你好', '謝謝', '對不起'], cat:'greet', catLabel:'問候' },
  { korean:'잘 부탁드립니다', romanize:'jal bu-tak-deu-rim-ni-da', meaning:'請多關照', wrong:['沒關係', '再見', '好的'], cat:'greet', catLabel:'問候' },
  { korean:'이거 주세요', romanize:'i-geo ju-se-yo', meaning:'請給我這個', wrong:['多少錢？', '哪裡是廁所？', '我要結帳'], cat:'food', catLabel:'餐廳' },
  { korean:'맛있어요', romanize:'ma-si-sseo-yo', meaning:'很好吃', wrong:['太辣了', '我吃飽了', '菜單在哪'], cat:'food', catLabel:'餐廳' },
  { korean:'계산해 주세요', romanize:'gye-san-hae ju-se-yo', meaning:'請幫我結帳', wrong:['請給我這個', '好吃', '有推薦嗎'], cat:'food', catLabel:'餐廳' },
  { korean:'얼마예요？', romanize:'eol-ma-ye-yo', meaning:'多少錢？', wrong:['在哪裡？', '有沒有？', '謝謝'], cat:'food', catLabel:'餐廳' },
  { korean:'메뉴 주세요', romanize:'me-nyu ju-se-yo', meaning:'請給我菜單', wrong:['結帳', '好吃', '推薦'], cat:'food', catLabel:'餐廳' },
  { korean:'포장해 주세요', romanize:'po-jang-hae ju-se-yo', meaning:'請幫我打包', wrong:['內用', '結帳', '加辣'], cat:'food', catLabel:'餐廳' },
  { korean:'깎아 주세요', romanize:'kka-kka ju-se-yo', meaning:'可以便宜一點嗎', wrong:['多少錢', '請給我這個', '有沒有大一點'], cat:'shop', catLabel:'購物' },
  { korean:'다른 색깔 있어요？', romanize:'da-reun saek-kkal i-sseo-yo', meaning:'有其他顏色嗎？', wrong:['有大一點嗎', '多少錢', '可以試穿嗎'], cat:'shop', catLabel:'購物' },
  { korean:'입어 봐도 돼요？', romanize:'i-beo bwa-do dwae-yo', meaning:'可以試穿嗎？', wrong:['有其他顏色嗎', '打折嗎', '收信用卡嗎'], cat:'shop', catLabel:'購物' },
  { korean:'카드 돼요？', romanize:'ka-deu dwae-yo', meaning:'可以刷卡嗎？', wrong:['可以打折嗎', '可以試穿嗎', '有大一點嗎'], cat:'shop', catLabel:'購物' },
  { korean:'영수증 주세요', romanize:'yeong-su-jeung ju-se-yo', meaning:'請給我收據', wrong:['結帳', '打包', '刷卡'], cat:'shop', catLabel:'購物' },
  { korean:'지하철역이 어디예요？', romanize:'ji-ha-cheol-yeog-i eo-di-ye-yo', meaning:'地鐵站在哪裡？', wrong:['公車站在哪', '計程車怎麼搭', '多少錢'], cat:'transport', catLabel:'交通' },
  { korean:'택시 불러 주세요', romanize:'taek-si bul-leo ju-se-yo', meaning:'請幫我叫計程車', wrong:['地鐵在哪', '怎麼走', '多遠'], cat:'transport', catLabel:'交通' },
  { korean:'여기서 내려 주세요', romanize:'yeo-gi-seo nae-ryeo ju-se-yo', meaning:'請在這裡讓我下車', wrong:['往左轉', '往右轉', '直走'], cat:'transport', catLabel:'交通' },
  { korean:'～에 가 주세요', romanize:'～e ga ju-se-yo', meaning:'請帶我去～（計程車用）', wrong:['在哪裡', '多遠', '多少錢'], cat:'transport', catLabel:'交通' },
  { korean:'화장실이 어디예요？', romanize:'hwa-jang-sil-i eo-di-ye-yo', meaning:'廁所在哪裡？', wrong:['出口在哪', '電梯在哪', '入口在哪'], cat:'transport', catLabel:'交通' },
  { korean:'체크인 하고 싶어요', romanize:'che-keu-in ha-go si-peo-yo', meaning:'我要辦理入住', wrong:['我要退房', '可以換房間嗎', '有無早餐'], cat:'hotel', catLabel:'住宿' },
  { korean:'체크아웃 부탁해요', romanize:'che-keu-a-ut bu-ta-kae-yo', meaning:'請幫我辦退房', wrong:['我要入住', '可以延遲退房嗎', '行李寄放'], cat:'hotel', catLabel:'住宿' },
  { korean:'짐 맡아 주세요', romanize:'jim ma-da ju-se-yo', meaning:'請幫我寄放行李', wrong:['退房', '入住', '換房間'], cat:'hotel', catLabel:'住宿' },
  { korean:'와이파이 비밀번호가 뭐예요？', romanize:'wa-i-pa-i bi-mil-beon-ho-ga mwo-ye-yo', meaning:'WiFi 密碼是什麼？', wrong:['電話號碼', '房間號碼', '退房時間'], cat:'hotel', catLabel:'住宿' },
  { korean:'도와 주세요！', romanize:'do-wa ju-se-yo', meaning:'請幫幫我！', wrong:['謝謝', '沒關係', '再見'], cat:'emergency', catLabel:'緊急' },
  { korean:'한국어를 못해요', romanize:'han-gu-geo-reul mo-tae-yo', meaning:'我不會說韓語', wrong:['我不懂日語', '我不懂英語', '我是台灣人'], cat:'emergency', catLabel:'緊急' },
  { korean:'영어 할 수 있어요？', romanize:'yeong-eo hal su i-sseo-yo', meaning:'你會說英語嗎？', wrong:['你會說中文嗎', '你會說日語嗎', '我不懂'], cat:'emergency', catLabel:'緊急' },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function setQuizMode(mode) {
  quizMode = mode;
  document.getElementById('qmode-alpha').classList.toggle('active', mode === 'alpha');
  document.getElementById('qmode-vocab').classList.toggle('active', mode === 'vocab');
  startQuiz();
}

function startQuiz() {
  quizScore = 0;
  quizTotal = 0;
  quizQueue = quizMode === 'alpha' ? shuffle(allChars).slice(0, 15) : shuffle(travelVocab).slice(0, 15);
  document.getElementById('quiz-main').style.display = 'block';
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('alpha-question').style.display = quizMode === 'alpha' ? 'block' : 'none';
  document.getElementById('vocab-question').style.display = quizMode === 'vocab' ? 'block' : 'none';
  updateQuizFavoriteButton();
  updateQuizSpeakButton();
  nextQuestion();
}

function nextQuestion() {
  if (quizQueue.length === 0) { showResult(); return; }
  answered = false;
  currentQ = quizQueue.shift();
  quizTotal++;
  updateQuizSpeakButton();

  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-feedback').className = 'feedback';
  document.getElementById('next-btn').classList.remove('show');

  if (quizMode === 'alpha') {
    updateQuizFavoriteButton();
    document.getElementById('quiz-char').textContent = currentQ.char;
    const others = shuffle(allChars.filter(c => c.char !== currentQ.char)).slice(0, 3);
    const options = shuffle([currentQ, ...others]);
    const container = document.getElementById('quiz-options');
    container.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn';
      btn.textContent = opt.reading;
      btn.onclick = () => checkAlphaAnswer(btn, opt.char === currentQ.char);
      container.appendChild(btn);
    });
  } else {
    document.getElementById('vocab-korean').textContent = currentQ.korean;
    document.getElementById('vocab-romanize').textContent = currentQ.romanize;
    const badge = document.getElementById('vocab-cat-badge');
    badge.textContent = currentQ.catLabel;
    badge.className = `vocab-cat-badge cat-${currentQ.cat}`;

    const options = shuffle([currentQ.meaning, ...shuffle(currentQ.wrong).slice(0, 3)]);
    const container = document.getElementById('quiz-options');
    container.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn';
      btn.textContent = opt;
      btn.style.fontSize = '13px';
      btn.style.lineHeight = '1.4';
      btn.onclick = () => checkVocabAnswer(btn, opt === currentQ.meaning);
      container.appendChild(btn);
    });
    updateQuizFavoriteButton();
  }

  updateScoreDisplay();
}

function checkAlphaAnswer(btn, isCorrect) {
  if (answered) return;
  answered = true;
  const allBtns = document.querySelectorAll('.quiz-btn');
  allBtns.forEach(b => {
    b.disabled = true;
    if (b.textContent === currentQ.reading) b.classList.add('correct');
  });
  const fb = document.getElementById('quiz-feedback');
  if (isCorrect) {
    quizScore++;
    btn.classList.add('correct');
    fb.textContent = ['✅ 答對了！','🎉 正確！','⭐ 棒棒！','👏 答對！'][Math.floor(Math.random()*4)];
    fb.className = 'feedback good';
  } else {
    btn.classList.add('wrong');
    fb.textContent = `❌ 正確答案是：${currentQ.reading}`;
    fb.className = 'feedback bad';
  }
  document.getElementById('next-btn').classList.add('show');
  updateScoreDisplay();
}

function checkVocabAnswer(btn, isCorrect) {
  if (answered) return;
  answered = true;
  const allBtns = document.querySelectorAll('.quiz-btn');
  allBtns.forEach(b => {
    b.disabled = true;
    if (b.textContent === currentQ.meaning) b.classList.add('correct');
  });
  const fb = document.getElementById('quiz-feedback');
  if (isCorrect) {
    quizScore++;
    btn.classList.add('correct');
    const tips = ['✅ 正確！旅遊加分！','🎉 答對了！','⭐ 記住了！出發前多練幾次','👏 很棒！'];
    fb.textContent = tips[Math.floor(Math.random()*tips.length)];
    fb.className = 'feedback good';
  } else {
    btn.classList.add('wrong');
    fb.textContent = `❌ 正確答案是：${currentQ.meaning}`;
    fb.className = 'feedback bad';
  }
  document.getElementById('next-btn').classList.add('show');
  updateScoreDisplay();
}

function updateScoreDisplay() {
  document.getElementById('score-display').textContent = `${quizScore} / ${quizTotal}`;
  const pct = quizTotal > 0 ? (quizTotal / 15) * 100 : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
}

function showResult() {
  document.getElementById('quiz-main').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';
  const pct = quizScore / 15;
  let emoji, title, sub;
  if (quizMode === 'vocab') {
    if (pct >= 0.9) { emoji='🛫'; title='準備出發！'; sub=`答對 ${quizScore}/15 題，韓國旅遊沒問題！`; }
    else if (pct >= 0.7) { emoji='🗺️'; title='旅遊基礎紮實！'; sub=`答對 ${quizScore}/15 題，再多練幾次更有把握！`; }
    else if (pct >= 0.5) { emoji='📖'; title='繼續加油！'; sub=`答對 ${quizScore}/15 題，建議先把常用句型背熟！`; }
    else { emoji='💪'; title='不要放棄！'; sub=`答對 ${quizScore}/15 題，多看幾遍再挑戰！`; }
  } else {
    if (pct >= 0.9) { emoji='🏆'; title='超級厲害！'; sub=`答對 ${quizScore}/15 題，諺文天才！`; }
    else if (pct >= 0.7) { emoji='🎉'; title='很不錯！'; sub=`答對 ${quizScore}/15 題，繼續練習會更好！`; }
    else if (pct >= 0.5) { emoji='💪'; title='加油！'; sub=`答對 ${quizScore}/15 題，多翻幾次牌就會記住！`; }
    else { emoji='📚'; title='繼續練習！'; sub=`答對 ${quizScore}/15 題，先去翻牌模式熟悉一下吧！`; }
  }
  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-sub').textContent = sub;
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t,i) => {
    t.classList.toggle('active', ['browse','flash','quiz'][i] === name);
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (name === 'quiz') startQuiz();
}
