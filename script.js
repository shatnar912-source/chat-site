// Global function stubs for sandbox/iframe compatibility
function sendMessage() { if(window._sendMessage) window._sendMessage(); }
function openChat(user) { if(window._openChat) window._openChat(user); }
function closeChat() { if(window._closeChat) window._closeChat(); }
function openDrawer() { if(window._openDrawer) window._openDrawer(); }
function closeDrawer() { if(window._closeDrawer) window._closeDrawer(); }
function openPrivateMessages() { if(window._openPrivateMessages) window._openPrivateMessages(); }
function closePrivateMessages() { if(window._closePrivateMessages) window._closePrivateMessages(); }
function renderUsers(filter) { if(window._renderUsers) window._renderUsers(filter); }
function editProfile() { if(window._editProfile) window._editProfile(); }
function updateProfileName(value) { if(window._updateProfileName) window._updateProfileName(value); }
function openMyProfile() { if(window._openMyProfile) window._openMyProfile(); }
function closeProfile() { if(window._closeProfile) window._closeProfile(); }
function showHome() { if(window._showHome) window._showHome(); }
function showFeaturedUsers() { if(window._showFeaturedUsers) window._showFeaturedUsers(); }
function chooseProfileImage() { if(window._chooseProfileImage) window._chooseProfileImage(); }
function saveProfile() { if(window._saveProfile) window._saveProfile(); }
function editMyProfile() { if(window._editMyProfile) window._editMyProfile(); }
function cancelProfileEdit() { if(window._cancelProfileEdit) window._cancelProfileEdit(); }
function openProfileChat() { if(window._openProfileChat) window._openProfileChat(); }
function blockProfileUser() { if(window._blockProfileUser) window._blockProfileUser(); }
function toggleProfileBlockedUsers() { if(window._toggleProfileBlockedUsers) window._toggleProfileBlockedUsers(); }
function unblockProfileUser(userId) { if(window._unblockProfileUser) window._unblockProfileUser(userId); }
function chooseAttachment() { if(window._chooseAttachment) window._chooseAttachment(); }
function toggleVoiceRecording() { if(window._toggleVoiceRecording) window._toggleVoiceRecording(); }
function openCountryPicker() { if(window._openCountryPicker) window._openCountryPicker(); }
function filterCountries(value) { if(window._filterCountries) window._filterCountries(value); }
function toggleCountryPicker(event) { if(window._toggleCountryPicker) window._toggleCountryPicker(event); }
function toggleChatMenu(event) { if(window._toggleChatMenu) window._toggleChatMenu(event); }
function openChatProfileFromMenu() { if(window._openChatProfileFromMenu) window._openChatProfileFromMenu(); }
function blockCurrentUser() { if(window._blockCurrentUser) window._blockCurrentUser(); }

(function() {
  'use strict';

  const embeddedWomanAvatar = 'data:image/webp;base64,UklGRuwDAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSNQBAAABCjm2tq1t9DdKaTrRzAZMOwjXw8tgZp7pOMzphmkDTFUY+mHGMLPM8q/v28Cr/4uICYDuSPmezrcfJpYcyMSHt117yiOKsmyq6x1dTbk2o731myNUYqf7F1JazcCZOIXolc8pD78g6lXw8PuUx+ZQyJOyJ+spz/HU6LN2/kiR/LnL0hSoXUwRFQS12HecFFmIrcF/nCL92C4qcCdF/HagCKvWoYZay93ORZ+8wFXZD5+hKXMReppi+TRU6PA6DxwuEP2QYvo+mu+KzxZ5Yl/4fI7mnPEZn1ZAZIBTvyhsWuBkBKj3Wdch0svLSPkor9GyPau8jHT5zDvfcnvzgZtMcBtf5rbkcAM/4SYT3MwHbvKW25subp17VnkZKR/lNVoW6eVlwqqOVx2waYGTESDSzwmigNOcBABin/kYycEVPpdV3ug7Lu9MPhxa54GDqmDwKY8nwUIo+8HBlMHtzkV6AuXaqnWoodZyh8BtakZQrP2Y1mMbxW+4T+nBRugMNS5RWW4KKb0le3/TwL4Spb3yheMdXlYqL8PHPnoFMcrj+PVvXny/EVcEk5dGlvTI8IWkImrvaB2aWHeH8cHmbaWKsl1z+GbPtzkn5WP2W/fNw9WlSjdWUDgg8gEAADANAJ0BKkAAQAA+2VqoTiglJCI1+5zJABsJbACvt8LA0Wm6ygu8Vekfbu+YDzWtNxCGr8aG0Lb+gtQ1Q5xrF2COJwOWSauXIvr4iM6rSsjcrjjBeOFVnxyypSllLIPZWlNb/wO4LO6RPq0i8XCInHUQAAD++uam7sujn/avwMXVkb/a+FwloNpRFR6x4DYcm/YbxCZ33RMZrE3R1YVrwSQhW657U499ZhktwZQM5DG7TAaokyd8fuGSpi4jDGuAvp53/iwHqAjsNvHZNPOD3QfY1IcZrZX27iQ+Mo+qaDPLE44nBzIslYMDmu+K5VeRtrpAUSzAr7Xoe/aUhKKtiee/QR8OX3nnOZvuCgtGlDTs3AwATS23PzjAuFqFnV/BApSzTufS6BxEeqcdOFbVtqELT4kBEFXOoN3EyAmZlqtGPoDz2JuMOuAT/VWelBevl73/wD+rPs19X+6HdfGfgqo6aixmcNYgOTBek4e2ThEcPLoV1bu6cZ/zLNGoTY5CTAiLmRVR0bOFJfb4O1GeVbQsU/7rtiPctoOvGFFpRq1aGCYaNasTXC741tnXSdkkMPWFzyjPP0u4eazyvr7KadVokrh11VodztaN88D3A+D39AAuHiqxdobCVCc5YUymbKbLQjR8g7pcg8hpTTWjkiHAAA==';
  const embeddedManAvatar = 'data:image/webp;base64,UklGRsgDAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSO8BAAABCkna/hmSFN1jV45t22obN+nSM0cwV/bMGTwr2zOl8a6xsrtXVbFIRca/DvCrf0TEBCCfT567avMOs3kVmMKckujNZ5m2zh5GIfP0ZrRkrlazGi78GJQ+OXGpMaTLovDbEal09F1ksQ5WSzInlYPDVlBFtc+zMlC8qC0KJHS0RwbOx0IBrLuXkxqCjbJ9Xwua8n5FJb+ltn9KlewzBY3/7Few7qvUmo2v0D2pOYd8FB3N6QZT5K22R2rPtZ6sF5Lgc8tLOEsBLR4WJyVJXuwWztFA2GXW2wJRA6eGUSojxumiJHvRYW6Czo85tpJBOlxii0rCEdtNSjcEMPkZpacsMDdDCXMFVrVRalsJbO6kBCOwo5dSz458sLmTEozAqjZKrSsF5mYoYa7A5KeUwAK4SemGABClFLaVDNLhw7Y5CTo/jA0X6VyEY8MIlRHjNOstFQMnhHM0EBaui5M0eJEbwlkKCAuPc95QYOMFTf369TfBc/Fp/VDsDeaxbmzgd2NCr8RG+D/8XyeGUFnJ+nAl1B5O6JKEUL3piR6GoX7O2f7gBs7PQZDjGl9lg8HrJhYBm1g6iIyZIzRcEvswpsZ8jC8VmlrNV1JDfobTV9kSOs8rj995+bujpw9sfr+8e6R8viA4ldds31XgNfMh8jkAVlA4ILIBAAAwCwCdASpAAEAAPvVeqU4qpL+iLhkuM/AeiWwAwgYAqXm3VN2GV9pmyU2d2QpjeNIbZK6aIn3vRgpQDmAsvzOR1sDYIo14gqz3isHpoBcIQGmZ7hQduqU1YvTBe9+ou0WLcAD+7rf//Dz/+GE//0P0ndQ63ry+qVz54UJlmnPeXGQhrZY+ccMv7OUby7MtFOusZP1K62HcCDBisK40vB96lkinaMRenkMLVwAMzROakLA31+lttOxAVxlrKdV2575WE10l288h2xIZiAdRO3ofYLLwQtGtvXPp3FiffnqJY0CfKIy3oa+PHxHiKjdBPSM33X5umpSyKXRivrBzcTtcz+24Np/iWjwNSfp5DcmJNSpKK1yZXRohBmMFk2bLqosVibdbrAieE/KmqRDOWr0vss0SQRDw7qKIhvTSb2xSjvNeDl86EzxVctQvug4poxr6dzF6crD++xxsEBe//bQv+xuly6+JkJfFujM9Hm3jGs8Q3haANWZTvqxQ1Kt0Z9RdBfW5xZVlsf5j2LxN7LdfEL/+Yl//LQP/+H8LbOTiebSJSG5CmFjt+s0Nv/E7unOAAA==';
  const embeddedHeroImage = 'data:image/webp;base64,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';

  const bios = [
    'مطور تطبيقات', 'مصمم جرافيك', 'كاتب محتوى',
    'لاعب ألعاب', 'مصور فوتوغرافي', 'موسيقي',
    'مسافر دائم', 'قارئ نهم', 'طالب جامعي',
    'رائد أعمال', 'شيف طبخ', 'رياضي',
    'مدون تقني', 'فنان رقمي', 'مترجم'
  ];

  const replies = [
    { text: 'مرحباً! أنا سعيد جداً بالتحدث معك', delay: 900 },
    { text: 'هذا موضوع مثير للاهتمام فعلاً!', delay: 1300 },
    { text: 'أتفق معك تماماً', delay: 1100 },
    { text: 'واو! لم أكن أعرف ذلك من قبل', delay: 1600 },
    { text: 'هههههه', delay: 700 },
    { text: 'بالتأكيد، دعنا نتحدث أكثر عن هذا الموضوع', delay: 1200 },
    { text: 'رائع! هذا ما كنت أبحث عنه بالضبط', delay: 1000 },
    { text: 'شكراً جزيلاً على المشاركة!', delay: 800 },
    { text: 'هل يمكنك إرسال المزيد من التفاصيل؟', delay: 1400 },
    { text: 'أحب هذا التطبيق كثيراً', delay: 600 },
    { text: 'هل تعرف أي أماكن حلوة نروحها؟', delay: 1100 },
    { text: 'صح كلامك مية بالمية!', delay: 500 },
  ];

  const countryCodes = [
    'AF','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ','BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BQ','BA','BW','BV','BR','IO','BN','BG','BF','BI','CV','KH','CM','CA','KY','CF','TD','CL','CN','CX','CC','CO','KM','CG','CD','CK','CR','CI','HR','CU','CW','CY','CZ','DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','SZ','ET','FK','FO','FJ','FI','FR','GF','PF','TF','GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GG','GN','GW','GY','HT','HM','VA','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','JM','JP','JE','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MO','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX','FM','MD','MC','MN','ME','MS','MA','MZ','MM','NA','NR','NP','NL','NC','NZ','NI','NE','NG','NU','NF','MK','MP','NO','OM','PK','PW','PS','PA','PG','PY','PE','PH','PN','PL','PT','PR','QA','RE','RO','RU','RW','BL','SH','KN','LC','MF','PM','VC','WS','SM','ST','SA','SN','RS','SC','SL','SG','SX','SK','SI','SB','SO','ZA','GS','SS','ES','LK','SD','SR','SJ','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','US','UM','UY','UZ','VU','VE','VN','VG','VI','WF','EH','YE','ZM','ZW'
  ];
  const countryNameFormatter = new Intl.DisplayNames(['ar'], { type: 'region' });
  const countries = countryCodes.map(code => ({
    code,
    name: countryNameFormatter.of(code) || code,
    flag: code.replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
  }));
  const demoCountries = ['EG', 'SA', 'AE', 'MA', 'JO', 'TN', 'DZ'];
  const demoAges = [28, 24, 31, 26, 29, 22, 27];
  const demoGenders = ['ذكر', 'أنثى', 'ذكر', 'أنثى', 'ذكر', 'ذكر', 'أنثى'];
  const featuredAfterMs = 60 * 60 * 1000;
  const inactiveResetMs = 2 * 60 * 1000;
  const initialSessionStartedAt = Date.now();

  let users = [
    { id: 1, name: 'أحمد علي', initials: 'أع', color: '#7c3aed', bio: bios[0], badge: 'vip', lastSeen: 'الآن', msgCount: 0, isNew: false },
    { id: 2, name: 'سارة محمد', initials: 'سم', color: '#c026d3', bio: bios[1], badge: null, lastSeen: 'الآن', msgCount: 0, isNew: false },
    { id: 3, name: 'محمد خالد', initials: 'مخ', color: '#9333ea', bio: bios[2], badge: 'new', lastSeen: 'الآن', msgCount: 0, isNew: false },
    { id: 4, name: 'ليلى أحمد', initials: 'لأ', color: '#6366f1', bio: bios[3], badge: null, lastSeen: 'الآن', msgCount: 0, isNew: false },
    { id: 5, name: 'عمر سامي', initials: 'عس', color: '#6d28d9', bio: bios[4], badge: 'vip', lastSeen: 'الآن', msgCount: 0, isNew: false },
    { id: 6, name: 'نور الدين', initials: 'ند', color: '#a855f7', bio: bios[5], badge: null, lastSeen: 'الآن', msgCount: 0, isNew: false },
    { id: 7, name: 'فاطمة يوسف', initials: 'في', color: '#8b5cf6', bio: bios[6], badge: 'new', lastSeen: 'الآن', msgCount: 0, isNew: false },
  ];
  users.forEach((user, index) => {
    user.age = demoAges[index];
    user.gender = demoGenders[index];
    user.countryCode = demoCountries[index];
    user.country = countries.find(country => country.code === user.countryCode);
    user.connectedAt = initialSessionStartedAt - (index === 0 || index === 4 ? 65 * 60 * 1000 : 0);
    user.lastActivityAt = initialSessionStartedAt;
    user.blockedUsers = [];
  });

  const extraNames = ['خالد', 'ريم', 'علي', 'هند', 'ياسين', 'مريم', 'طارق', 'دنيا', 'حسن', 'آية', 'زياد', 'لمى', 'فهد', 'رنا'];
  const colors = ['#7c3aed', '#c026d3', '#9333ea', '#6366f1', '#6d28d9', '#a855f7', '#8b5cf6', '#ec4899', '#d946ef', '#a855f7'];

  let currentChatUser = null;
  let messages = {};
  let userIdCounter = 8;
  let isTyping = false;
  let totalChats = 0;
  let profileTargetUser = null;
  let mediaRecorder = null;
  let audioChunks = [];
  let isRecording = false;
  let blockedUsers = new Set();
  const blockedUsersByOwner = new Map();
  let selectedCountry = null;
  let messageAnimations = new Set();
  let isFeaturedView = false;
  const myProfile = {
    id: 'me',
    name: 'أحمد محمد',
    initials: 'أم',
    color: '#7c3aed',
    bio: 'متصل الآن',
    age: 28,
    gender: 'ذكر',
    nationality: 'مصر',
    countryCode: 'EG',
    country: countries.find(country => country.code === 'EG'),
    avatar: '',
    blockedUsers: []
  };
  const blockedUsersStorageKey = 'mofchat.blocked-users.v1';

  const isCurrentUser = user => Boolean(
    user && (user === myProfile || user.id === myProfile.id || user.name === myProfile.name)
  );

  const privateMessagesData = [
    { id: 101, name: 'سارة محمد', initials: 'سم', color: '#c026d3', preview: 'مرحباً! كيف حالك اليوم؟', time: '10:30', unread: 2 },
    { id: 102, name: 'محمد خالد', initials: 'مخ', color: '#9333ea', preview: 'هل رأيت التحديث الجديد؟', time: '09:15', unread: 1 },
    { id: 103, name: 'عمر سامي', initials: 'عس', color: '#6d28d9', preview: 'شكراً جزيلاً على المساعدة!', time: 'أمس', unread: 0 },
    { id: 104, name: 'ليلى أحمد', initials: 'لأ', color: '#6366f1', preview: 'متى نلتقي غداً؟', time: 'أمس', unread: 0 },
    { id: 105, name: 'فاطمة يوسف', initials: 'في', color: '#8b5cf6', preview: 'أرسلت لك الملف المطلوب', time: 'الأحد', unread: 0 },
  ];

  const embeddedHeroImageFixed = embeddedHeroImage
    .replace('v9ag8qwy', 'v9GdRKFiq7f5SMpDt9ag8qwy')
    .replace('B54cckqJu4', 'B54ccqkJu4')
    .replace('SKpu+3Y5', 'SKpu3+1Y5');
  const heroImage = document.querySelector('.hero-romance-image');
  if (heroImage) heroImage.src = embeddedHeroImageFixed;
  const $ = id => document.getElementById(id);
  const usersList = $('users-list');
  const mainView = $('main-view');
  const mainHeader = $('main-header');
  const chatView = $('chat-view');
  const chatUsername = $('chat-username');
  const chatUsernameBadge = $('chat-username-badge');
  const chatAvatar = $('chat-avatar');
  const chatStatusText = $('chat-status-text');
  const chatStatus = $('chat-status');
  const messagesArea = $('messages-area');
  const msgInput = $('msg-input');
  const sendBtn = $('send-btn');
  const backBtn = $('back-btn');
  const onlineCount = $('stat-users');
  const statChats = $('stat-chats');
  const searchInput = $('search-input');
  const toast = $('toast');
  const toastText = $('toast-text');
  const menuBtn = $('menu-btn');
  const drawerOverlay = $('drawer-overlay');
  const sideDrawer = $('side-drawer');
  const drawerMenu = document.querySelector('.drawer-menu');
  const drawerClose = $('drawer-close');
  const drawerProfileName = $('drawer-profile-name');
  const drawerProfileAvatar = $('drawer-profile-avatar');
  const messagesIconBtn = $('messages-icon-btn');
  const messagesBadge = $('messages-badge');
  const privateMessagesPage = $('private-messages-page');
  const privateMessagesBack = $('private-messages-back');
  const privateMessagesList = $('private-messages-list');
  const profilePage = $('profile-page');
  const profileAvatar = $('profile-avatar');
  const profileAvatarInput = $('profile-avatar-input');
  const profileNameInput = $('profile-name-input');
  const profileAgeInput = $('profile-age-input');
  const profileGenderInput = $('profile-gender-input');
  const profileNationalityInput = $('profile-nationality-input');
  const profileDisplayName = $('profile-display-name');
  const profileDisplayBadge = $('profile-display-badge');
  const profileDisplayBio = $('profile-display-bio');
  const profileDisplayAge = $('profile-display-age');
  const profileDisplayGender = $('profile-display-gender');
  const profileDisplayNationality = $('profile-display-nationality');
  const selectedCountryFlag = $('selected-country-flag');
  const countryOptions = $('country-options');
  const profileDetails = $('profile-details');
  const profileBlockedUsers = $('profile-blocked-users');
  const profileBlockedUsersToggle = $('profile-blocked-users-toggle');
  const profileBlockedUsersCount = $('profile-blocked-users-count');
  const profileBlockedUsersList = $('profile-blocked-users-list');
  const profileUserActions = $('profile-user-actions');
  const profileChatBtn = $('profile-chat-btn');
  const profileBlockBtn = $('profile-block-btn');
  const directoryTitle = $('directory-title');
  const directoryStatus = $('directory-status');
  const profileEditBtn = $('profile-edit-btn');
  const profileForm = $('profile-form');
  const profileAvatarEdit = $('profile-avatar-edit');
  const attachmentInput = $('attachment-input');
  const voiceBtn = $('voice-btn');
  const chatMoreMenu = $('chat-more-menu');
  let currentAppView = 'home';

  function getNavigationStack() {
    return history.state && history.state.mofchatStack
      ? history.state.mofchatStack
      : [currentAppView];
  }

  function pushAppView(view) {
    if (currentAppView === view) return;
    const stack = [...getNavigationStack(), view];
    history.pushState({ mofchat: true, mofchatView: view, mofchatStack: stack }, '', location.href);
    currentAppView = view;
  }

  function replaceAppView(view) {
    const stack = getNavigationStack();
    const nextStack = [...stack.slice(0, -1), view];
    history.replaceState({ mofchat: true, mofchatView: view, mofchatStack: nextStack }, '', location.href);
    currentAppView = view;
  }

  function applyAppView(view) {
    if (view !== 'chat' && currentAppView === 'chat') {
      currentChatUser = null;
      isTyping = false;
    }
    if (view !== 'profile') profileTargetUser = null;

    profilePage.style.display = view === 'profile' ? 'flex' : 'none';
    privateMessagesPage.style.display = view === 'private' ? 'flex' : 'none';
    chatView.style.display = view === 'chat' ? 'flex' : 'none';
    document.body.style.overflow = view === 'profile' || view === 'private' ? 'hidden' : '';
    if (view === 'private') renderPrivateMessages();
    currentAppView = view;
  }

  function goBackInApp() {
    if (currentAppView === 'home') {
      applyAppView('home');
    } else if (history.state && history.state.mofchat) {
      history.back();
    } else {
      applyAppView('home');
    }
  }

  window.addEventListener('popstate', event => {
    if (event.state && event.state.mofchat) {
      applyAppView(event.state.mofchatView || 'home');
    } else {
      applyAppView('home');
    }
  });
  if (!history.state || !history.state.mofchat) {
    history.replaceState(
      { mofchat: true, mofchatView: 'home', mofchatStack: ['home'] },
      '',
      location.href
    );
  }

  function getCountry(value) {
    return countries.find(country => country.code === value) ||
      countries.find(country => country.name === value) ||
      null;
  }

  function getBlockedUsersFor(user) {
    if (!user) return [];
    if (Array.isArray(user.blockedUsers)) return user.blockedUsers;
    const ownerKey = String(user.id);
    if (!blockedUsersByOwner.has(ownerKey)) blockedUsersByOwner.set(ownerKey, []);
    return blockedUsersByOwner.get(ownerKey);
  }

  function saveMyBlockedUsers() {
    try {
      localStorage.setItem(
        blockedUsersStorageKey,
        JSON.stringify(getBlockedUsersFor(myProfile))
      );
    } catch (error) {
      // Keep the in-memory block active if browser storage is unavailable.
    }
  }

  function restoreMyBlockedUsers() {
    try {
      const stored = JSON.parse(localStorage.getItem(blockedUsersStorageKey) || '[]');
      if (!Array.isArray(stored)) return;

      myProfile.blockedUsers = stored.filter(user => user && user.id !== undefined);
      myProfile.blockedUsers.forEach(user => blockedUsers.add(user.id));
      users = users.filter(user => !blockedUsers.has(user.id));
    } catch (error) {
      // Ignore invalid old storage and keep the clean in-memory state.
    }
  }

  function addBlockedUser(owner, blockedUser) {
    const blockedList = getBlockedUsersFor(owner);
    if (!blockedList.some(user => user.id === blockedUser.id)) {
      blockedList.push({ ...blockedUser });
      if (owner.id === myProfile.id) saveMyBlockedUsers();
    }
  }

  function getAvatarMarkup(user) {
    if (user.avatar) {
      return `<img class="avatar-image" src="${user.avatar}" alt="">`;
    }
    const isFemale = user.gender === 'أنثى';
    const defaultAvatar = isFemale ? embeddedWomanAvatar : embeddedManAvatar;
    return `<img class="avatar-image default-avatar" src="${defaultAvatar}" alt="">`;
  }

  function renderCountryOptions(filter = '') {
    const normalizedFilter = filter.trim().toLowerCase();
    const filteredCountries = countries.filter(country =>
      !normalizedFilter ||
      country.name.toLowerCase().includes(normalizedFilter) ||
      country.code.toLowerCase().includes(normalizedFilter)
    );

    countryOptions.innerHTML = filteredCountries.map(country => `
      <button type="button" class="country-option" onclick="selectCountry('${country.code}')">
        <span class="country-option-flag">${country.flag}</span>
        <span>${country.name}</span>
      </button>
    `).join('') || '<div class="country-empty">لا توجد دولة بهذا الاسم</div>';
    countryOptions.classList.add('open');
  }

  window.selectCountry = function(code) {
    selectedCountry = getCountry(code);
    if (!selectedCountry) return;
    profileNationalityInput.value = selectedCountry.name;
    selectedCountryFlag.textContent = selectedCountry.flag;
    countryOptions.classList.remove('open');
  };

  window._openCountryPicker = function() {
    renderCountryOptions(profileNationalityInput.value);
  };

  window._filterCountries = function(value) {
    selectedCountry = null;
    selectedCountryFlag.textContent = '🌍';
    renderCountryOptions(value);
  };

  window._toggleCountryPicker = function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (countryOptions.classList.contains('open')) {
      countryOptions.classList.remove('open');
    } else {
      renderCountryOptions(profileNationalityInput.value);
    }
  };

  function getTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  function showToast(text) {
    toastText.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function isFeaturedUser(user, now = Date.now()) {
    const isActiveUser = user && users.some(activeUser => activeUser.id === user.id);
    return Boolean(isActiveUser && user.connectedAt && now - user.connectedAt >= featuredAfterMs);
  }

  function getUserBadgeMarkup(user, now = Date.now()) {
    if (isFeaturedUser(user, now)) {
      return '<span class="user-badge badge-vip">VIP</span>';
    }
    return '';
  }

  function generateId() { return Date.now() + Math.random().toString(36).substr(2, 9); }

  function createFeaturedMenuItem() {
    const item = document.createElement('div');
    item.className = 'drawer-menu-item featured-menu-item';
    item.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>
      </svg>
      المستخدمون المميزون
    `;
    item.addEventListener('click', () => {
      window._showFeaturedUsers();
      window._closeDrawer();
    });
    return item;
  }

  function configureDrawerMenu() {
    if (!drawerMenu) return;
    const sections = Array.from(drawerMenu.querySelectorAll('.drawer-menu-section'));
    const items = Array.from(drawerMenu.querySelectorAll('.drawer-menu-item'));
    const findItem = label => items.find(item => item.textContent.includes(label));
    const accountItem = findItem('حسابي');
    const homeItem = findItem('الرئيسية');
    const settingsItem = findItem('الإعدادات');
    const logoutItem = findItem('تسجيل الخروج');
    if (!accountItem || !homeItem || !settingsItem || !logoutItem) return;

    const firstSection = sections[0];
    sections.slice(1).forEach(section => section.remove());
    const title = firstSection.querySelector('.drawer-menu-title');
    firstSection.innerHTML = '';
    if (title) {
      title.textContent = 'القائمة';
      firstSection.appendChild(title);
    }

    const featuredItem = createFeaturedMenuItem();
    const orderedItems = [accountItem, homeItem, featuredItem, settingsItem, logoutItem];
    orderedItems.forEach(item => {
      if (item !== featuredItem) item.removeAttribute('onclick');
      firstSection.appendChild(item);
    });
    accountItem.addEventListener('click', () => {
      window._closeDrawer();
      window._openMyProfile();
    });
    homeItem.addEventListener('click', () => {
      window._showHome();
      window._closeDrawer();
    });
    settingsItem.addEventListener('click', () => window._closeDrawer());
    logoutItem.addEventListener('click', () => window._closeDrawer());
  }

  function formatConnectionDuration(user) {
    const minutes = Math.max(0, Math.floor((Date.now() - user.connectedAt) / 60000));
    if (minutes < 60) return `${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes ? `${hours} س و ${remainingMinutes} د` : `${hours} ساعة`;
  }

  function refreshActivityState() {
    if (document.hidden) return;
    const now = Date.now();
    let activityWasReset = false;
    users.forEach(user => {
      if (!user.lastActivityAt || now - user.lastActivityAt >= inactiveResetMs) {
        user.connectedAt = now;
        activityWasReset = true;
      }
      user.lastActivityAt = now;
    });
    if (activityWasReset) refreshVipDisplays(isFeaturedView);
  }

  window._showHome = function() {
    isFeaturedView = false;
    if (directoryTitle) directoryTitle.textContent = 'المتصلون الآن';
    if (directoryStatus) directoryStatus.innerHTML = '<span class="dot"></span>مباشر';
    window._renderUsers(searchInput.value);
  };

  window._showFeaturedUsers = function() {
    isFeaturedView = true;
    if (directoryTitle) directoryTitle.textContent = 'المستخدمون المميزون';
    if (directoryStatus) directoryStatus.innerHTML = '<span class="dot"></span>مباشر';
    window._renderUsers(searchInput.value);
  };

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshActivityState();
  });

  window._openDrawer = function() {
    drawerOverlay.classList.add('active');
    sideDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window._closeDrawer = function() {
    drawerOverlay.classList.remove('active');
    sideDrawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  window._openPrivateMessages = function() {
    pushAppView('private');
    privateMessagesPage.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    renderPrivateMessages();
  };

  window._closePrivateMessages = function() {
    goBackInApp();
  };

  window._editProfile = function() {
    window._openMyProfile();
  };

  window._updateProfileName = function(value) {
    const newName = value.trim();
    if (newName) {
      showToast('تم تحديث الاسم إلى: ' + newName);
      const names = newName.split(' ');
      const initials = names.map(n => n[0]).join('');
      myProfile.name = newName;
      myProfile.initials = initials.slice(0, 3);
      drawerProfileAvatar.childNodes[0].textContent = initials;
    }
  };

  function renderProfileAvatar(user) {
    profileAvatar.textContent = '';
    if (user.avatar) {
      profileAvatar.className = 'profile-avatar';
      profileAvatar.style.background = `url("${user.avatar}") center / cover no-repeat`;
    } else {
      profileAvatar.style.background = '';
      profileAvatar.className = `profile-avatar avatar-placeholder ${user.gender === 'أنثى' ? 'female' : 'male'}`;
      profileAvatar.innerHTML = getAvatarMarkup(user);
    }
  }

  function renderProfile(user) {
    const profileCountry = user.country || getCountry(user.countryCode) || getCountry(user.nationality);
    const isMine = user.id === myProfile.id;
    selectedCountry = profileCountry;
    profileNameInput.value = user.name || '';
    profileAgeInput.value = user.age || '';
    profileGenderInput.value = user.gender || '';
    profileNationalityInput.value = profileCountry ? profileCountry.name : (user.nationality || '');
    selectedCountryFlag.textContent = profileCountry ? profileCountry.flag : '🌍';
    profileDisplayName.textContent = user.name || 'مستخدم';
    profileDisplayBadge.innerHTML = getUserBadgeMarkup(user);
    profileDisplayBio.textContent = user.bio || 'متصل الآن';
    profileDisplayAge.textContent = user.age || 'غير محدد';
    profileDisplayGender.textContent = user.gender || 'غير محدد';
    profileDisplayNationality.textContent = profileCountry ? profileCountry.name : (user.nationality || 'غير محدد');
    if (profileBlockedUsers) profileBlockedUsers.style.display = isMine ? 'block' : 'none';
    if (isMine) renderProfileBlockedUsers(user);
    profileEditBtn.style.display = isMine ? 'flex' : 'none';
    profileAvatarEdit.style.display = isMine ? 'flex' : 'none';
    profileUserActions.style.display = isMine ? 'none' : 'flex';
    profileChatBtn.style.display = isMine ? 'none' : 'flex';
    profileBlockBtn.style.display = isMine ? 'none' : 'flex';
    profileForm.style.display = 'none';
    profileDetails.style.display = 'flex';
    renderProfileAvatar(user);
  }

  function renderProfileBlockedUsers(user, keepOpen = false) {
    if (!profileBlockedUsersCount || !profileBlockedUsersList || !profileBlockedUsersToggle) return;
    const wasOpen = keepOpen && profileBlockedUsersList.classList.contains('open');
    const blockedList = getBlockedUsersFor(user);
    profileBlockedUsersCount.textContent = blockedList.length;
    profileBlockedUsersToggle.setAttribute('aria-expanded', String(wasOpen));
    profileBlockedUsersList.classList.toggle('open', wasOpen);
    profileBlockedUsersList.innerHTML = blockedList.length
      ? blockedList.map(blockedUser => `
          <div class="profile-blocked-user">
            <div class="profile-blocked-user-avatar">${getAvatarMarkup(blockedUser)}</div>
            <span class="profile-blocked-user-name">${blockedUser.name || 'مستخدم'}</span>
            <button type="button" class="profile-unblock-btn" data-unblock-user="${blockedUser.id}" aria-label="فك حظر ${blockedUser.name || 'المستخدم'}">فك الحظر</button>
          </div>
        `).join('')
      : '<div class="profile-blocked-empty">لا يوجد مستخدمون محظورون</div>';

    profileBlockedUsersList.querySelectorAll('[data-unblock-user]').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        window._unblockProfileUser(button.dataset.unblockUser);
      });
    });
  }

  window._toggleProfileBlockedUsers = function() {
    if (!profileBlockedUsersList || !profileBlockedUsersToggle) return;
    const isOpen = profileBlockedUsersList.classList.toggle('open');
    profileBlockedUsersToggle.setAttribute('aria-expanded', String(isOpen));
  };

  window._unblockProfileUser = function(userId) {
    if (!profileTargetUser) return;
    const blockedList = getBlockedUsersFor(profileTargetUser);
    const blockedIndex = blockedList.findIndex(user => String(user.id) === String(userId));
    if (blockedIndex === -1) return;

    const [unblockedUser] = blockedList.splice(blockedIndex, 1);
    if (profileTargetUser.id === myProfile.id) {
      blockedUsers.delete(unblockedUser.id);
      saveMyBlockedUsers();
      if (!users.some(user => user.id === unblockedUser.id)) {
        unblockedUser.lastSeen = 'الآن';
        unblockedUser.connectedAt = Date.now();
        unblockedUser.lastActivityAt = Date.now();
        users.unshift(unblockedUser);
      }
      window._renderUsers(searchInput.value);
    }

    renderProfileBlockedUsers(profileTargetUser, true);
    showToast('تم فك الحظر عن ' + (unblockedUser.name || 'المستخدم'));
  };

  window._openUserProfile = function(user) {
    profileTargetUser = user;
    pushAppView('profile');
    renderProfile(user);
    profilePage.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window._openMyProfile = function() {
    window._closeDrawer();
    window._openUserProfile(myProfile);
  };

  window._openProfileChat = function() {
    if (!profileTargetUser || profileTargetUser.id === myProfile.id) return;
    const user = users.find(item => item.id === profileTargetUser.id) || profileTargetUser;
    profilePage.style.display = 'none';
    document.body.style.overflow = '';
    window._openChat(user);
  };

  window._blockProfileUser = function() {
    if (!profileTargetUser || profileTargetUser.id === myProfile.id) return;
    const blockedUser = profileTargetUser;
    blockedUsers.add(blockedUser.id);
    addBlockedUser(myProfile, blockedUser);
    users = users.filter(user => user.id !== blockedUser.id);
    window._closeProfile();
    showToast('تم حظر ' + blockedUser.name);
    refreshVipDisplays(true);
  };

  window._closeProfile = function() {
    goBackInApp();
  };

  window._chooseProfileImage = function() {
    if (profileTargetUser && profileTargetUser.id === myProfile.id) profileAvatarInput.click();
  };

  window._editMyProfile = function() {
    if (!profileTargetUser || profileTargetUser.id !== myProfile.id) return;
    profileDetails.style.display = 'none';
    profileEditBtn.style.display = 'none';
    profileAvatarEdit.style.display = 'flex';
    profileForm.style.display = 'flex';
  };

  window._cancelProfileEdit = function() {
    if (!profileTargetUser) return;
    renderProfile(profileTargetUser);
  };

  profileAvatarInput.addEventListener('change', function() {
    const file = profileAvatarInput.files && profileAvatarInput.files[0];
    if (!file || !profileTargetUser) return;
    const reader = new FileReader();
    reader.onload = () => {
      profileTargetUser.avatar = reader.result;
      renderProfileAvatar(profileTargetUser);
    };
    reader.readAsDataURL(file);
  });

  window._saveProfile = function() {
    if (!profileTargetUser) return;
    const newName = profileNameInput.value.trim();
    if (!newName) {
      showToast('اكتب الاسم أولاً');
      return;
    }

    profileTargetUser.name = newName;
    profileTargetUser.age = profileAgeInput.value.trim();
    profileTargetUser.gender = profileGenderInput.value;
    const chosenCountry = selectedCountry || getCountry(profileNationalityInput.value.trim());
    if (profileNationalityInput.value.trim() && !chosenCountry) {
      showToast('اختر دولة من القائمة');
      return;
    }
    profileTargetUser.nationality = chosenCountry ? chosenCountry.name : '';
    profileTargetUser.countryCode = chosenCountry ? chosenCountry.code : '';
    profileTargetUser.country = chosenCountry || null;
    profileTargetUser.initials = newName.split(' ').map(n => n[0]).join('').slice(0, 3);

    if (profileTargetUser.id === myProfile.id) {
      drawerProfileName.value = profileTargetUser.name;
      drawerProfileAvatar.childNodes[0].textContent = profileTargetUser.initials;
      renderProfile(profileTargetUser);
    } else {
      window._renderUsers(searchInput.value);
    }
    showToast('تم حفظ بيانات الملف الشخصي');
  };

  window._toggleChatMenu = function(event) {
    event.stopPropagation();
    chatMoreMenu.classList.toggle('open');
  };

  window._openChatProfileFromMenu = function() {
    chatMoreMenu.classList.remove('open');
    if (currentChatUser) window._openUserProfile(currentChatUser);
  };

  window._blockCurrentUser = function() {
    if (!currentChatUser) return;
    const blockedUser = currentChatUser;
    blockedUsers.add(blockedUser.id);
    addBlockedUser(myProfile, blockedUser);
    users = users.filter(user => user.id !== blockedUser.id);
    chatMoreMenu.classList.remove('open');
    window._closeChat();
    showToast('تم حظر ' + blockedUser.name);
    refreshVipDisplays(true);
  };

  document.addEventListener('click', event => {
    if (!event.target.closest('.chat-header-actions')) chatMoreMenu.classList.remove('open');
    if (!event.target.closest('.profile-field')) countryOptions.classList.remove('open');
  });

  window._chooseAttachment = function() {
    if (!currentChatUser) return;
    attachmentInput.click();
  };

  attachmentInput.addEventListener('change', function() {
    const file = attachmentInput.files && attachmentInput.files[0];
    if (!file || !currentChatUser) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      showToast('يمكن إرسال الصور والفيديو فقط');
      attachmentInput.value = '';
      return;
    }
    messages[currentChatUser.id].push({
      id: generateId(),
      from: 'me',
      text: file.name,
      time: getTime(),
      read: false,
      type: 'media',
      mediaUrl: URL.createObjectURL(file),
      mediaType: file.type
    });
    currentChatUser.msgCount++;
    renderMessages();
    showToast('تم إرفاق الملف: ' + file.name);
    attachmentInput.value = '';
  });

  window._toggleVoiceRecording = async function() {
    if (!currentChatUser) return;

    if (isRecording) {
      mediaRecorder.stop();
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      showToast('التسجيل الصوتي غير مدعوم على هذا الجهاز');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        messages[currentChatUser.id].push({
          id: generateId(),
          from: 'me',
          text: 'تسجيل صوتي',
          audioUrl,
          time: getTime(),
          read: false,
          type: 'audio'
        });
        currentChatUser.msgCount++;
        renderMessages();
        showToast('تم إرسال التسجيل الصوتي');
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.title = 'تسجيل صوتي';
      };
      mediaRecorder.start();
      isRecording = true;
      voiceBtn.classList.add('recording');
      voiceBtn.title = 'إيقاف التسجيل';
      showToast('جاري التسجيل... اضغط مرة أخرى للإرسال');
    } catch (error) {
      isRecording = false;
      showToast('لم يتم السماح باستخدام الميكروفون');
    }
  };

  function renderPrivateMessages() {
    privateMessagesList.innerHTML = '';

    if (privateMessagesData.length === 0) {
      privateMessagesList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="empty-title">لا توجد رسائل</div>
          <div class="empty-desc">ابدأ محادثة جديدة مع أحد المتصلين الآن</div>
        </div>
      `;
      return;
    }

    privateMessagesData.forEach((msg, i) => {
      const card = document.createElement('div');
      card.className = 'private-msg-card';
      card.style.animationDelay = (i * 0.06) + 's';
      const linkedUser = users.find(user => user.name === msg.name);
      const badgeHtml = getUserBadgeMarkup(linkedUser);
      const avatarUser = linkedUser || { gender: msg.gender || 'ذكر' };

      const unreadBadge = msg.unread > 0 
        ? `<span class="private-msg-unread">${msg.unread}</span>` 
        : '';

      card.innerHTML = `
        <div class="private-msg-avatar">${getAvatarMarkup(avatarUser)}</div>
        <div class="private-msg-info">
          <div class="private-msg-name"><span>${msg.name}</span>${badgeHtml}</div>
          <div class="private-msg-preview">${msg.preview}</div>
        </div>
        <div class="private-msg-meta">
          <span class="private-msg-time">${msg.time}</span>
          ${unreadBadge}
        </div>
      `;
      card.querySelector('.private-msg-avatar').addEventListener('click', (event) => {
        event.stopPropagation();
        const existingUser = users.find(user => user.name === msg.name);
        window._openUserProfile(existingUser || {
          id: msg.id,
          name: msg.name,
          initials: msg.initials,
          color: msg.color,
          bio: '',
          age: 0,
          gender: '',
          nationality: 'غير محددة',
          country: null,
          avatar: ''
        });
      });

      card.addEventListener('click', () => {
        let user = users.find(u => u.name === msg.name);
        if (!user) {
          user = {
            id: userIdCounter++,
            name: msg.name,
            initials: msg.initials,
            color: msg.color,
            bio: bios[Math.floor(Math.random() * bios.length)],
            age: Math.floor(Math.random() * 25) + 18,
            country: countries[Math.floor(Math.random() * countries.length)],
            badge: null,
            lastSeen: 'الآن',
            msgCount: 0,
            isNew: false
          };
          user.countryCode = user.country.code;
          user.nationality = user.country.name;
          users.push(user);
        }
        if (isCurrentUser(user)) {
          window._closePrivateMessages();
          window._openUserProfile(user);
        } else {
          openChat(user);
        }
        msg.unread = 0;
        updateMessagesBadge();
      });

      privateMessagesList.appendChild(card);
    });
  }

  function updateMessagesBadge() {
    const totalUnread = privateMessagesData.reduce((sum, m) => sum + m.unread, 0);
    if (totalUnread > 0) {
      messagesBadge.textContent = totalUnread;
      messagesBadge.style.display = 'flex';
    } else {
      messagesBadge.style.display = 'none';
    }
  }

  window._renderUsers = function(filter) {
    filter = filter || '';
    const now = Date.now();
    const filtered = users.filter(u =>
      !blockedUsers.has(u.id) &&
      u.name.includes(filter) &&
      (!isFeaturedView || (u.connectedAt && now - u.connectedAt >= featuredAfterMs))
    );

    if (filtered.length === 0) {
      usersList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <div class="empty-title">لا يوجد مستخدمين</div>
          <div class="empty-desc">جرب بحث مختلف أو انتظر حتى ينضم مستخدمون جدد للدردشة</div>
        </div>
      `;
       if (onlineCount) onlineCount.textContent = '0';
      return;
    }

    usersList.innerHTML = '';

    filtered.forEach((user, i) => {
      const card = document.createElement('div');
      card.className = 'user-card' + (user.isNew ? ' new-user' : '');
      card.dataset.userId = String(user.id);
      card.style.animationDelay = (i * 0.06) + 's';
      const isMine = isCurrentUser(user);

       const badgeHtml = isFeaturedView
         ? '<span class="user-badge badge-vip">VIP</span>'
         : getUserBadgeMarkup(user, now);
      const userActionMarkup = isMine ? '' : `
        <div class="user-action">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m22 2-7 20-4-9-9-4 20-7z"/>
          </svg>
        </div>
      `;

      card.innerHTML = `
        <div class="user-avatar-wrap">
           <div class="user-avatar ${user.gender === 'أنثى' ? 'avatar-placeholder female' : 'avatar-placeholder male'}" style="${user.avatar ? `background: url("${user.avatar}") center / cover no-repeat` : ''}">${user.avatar ? '' : getAvatarMarkup(user)}</div>
          <span class="user-status-dot"></span>
        </div>
        <div class="user-info">
          <div class="user-name-row">
            <span class="user-name">${user.name}</span>
            ${badgeHtml}
          </div>
           <div class="user-meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               ${user.age || '—'} سنة
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
               ${user.country ? user.country.flag : '🌍'} ${user.country ? user.country.name : 'غير محددة'}
            </span>
          </div>
        </div>
        ${userActionMarkup}
      `;
      card.querySelector('.user-avatar').addEventListener('click', (event) => {
        event.stopPropagation();
        window._openUserProfile(user);
      });
      card.addEventListener('click', () => {
        if (isMine) {
          window._openUserProfile(user);
        } else {
          openChat(user);
        }
      });
      usersList.appendChild(card);
    });

     if (onlineCount) onlineCount.textContent = filtered.length;
  };

  window._openChat = function(user) {
    if (!user || isCurrentUser(user)) {
      showToast('لا يمكنك بدء محادثة مع نفسك');
      return;
    }
    pushAppView('chat');
    profilePage.style.display = 'none';
    privateMessagesPage.style.display = 'none';
    currentChatUser = user;
    chatUsername.textContent = user.name;
    chatUsernameBadge.innerHTML = getUserBadgeMarkup(user);
    chatAvatar.className = `chat-avatar ${user.avatar ? '' : `avatar-placeholder ${user.gender === 'أنثى' ? 'female' : 'male'}`}`;
    chatAvatar.style.background = user.avatar ? `url("${user.avatar}") center / cover no-repeat` : '';
    chatAvatar.innerHTML = user.avatar ? '' : getAvatarMarkup(user);
    chatStatusText.textContent = 'يكتب الآن...';
    chatStatus.classList.add('typing');

    if (!messages[user.id]) {
      messages[user.id] = [
        { id: generateId(), from: 'them', text: 'مرحباً! أنا ' + user.name + ' سعيد بالتحدث معك!', time: getTime(), read: true }
      ];
      messages[user.id].forEach(message => messageAnimations.add(message.id));
    }
    renderMessages();

    chatView.style.display = 'flex';
    msgInput.focus();

    setTimeout(() => {
      if (currentChatUser && currentChatUser.id === user.id) {
        chatStatusText.textContent = 'متصل الآن';
        chatStatus.classList.remove('typing');
      }
    }, 2200);
  };

  window._closeChat = function() {
    goBackInApp();
    currentChatUser = null;
    isTyping = false;
    renderUsers(searchInput.value);
  };

  function refreshVipDisplays(forceRenderUsers = false) {
    if (forceRenderUsers) {
      window._renderUsers(searchInput.value);
    } else {
      usersList.querySelectorAll('.user-card[data-user-id]').forEach(card => {
        const user = users.find(item => String(item.id) === card.dataset.userId);
        const nameRow = card.querySelector('.user-name-row');
        if (!user || !nameRow) return;

        const badgeHtml = getUserBadgeMarkup(user);
        const currentBadge = nameRow.querySelector('.user-badge');
        if (currentBadge) currentBadge.remove();
        if (badgeHtml) nameRow.insertAdjacentHTML('beforeend', badgeHtml);
      });
    }
    if (currentChatUser) {
      chatUsernameBadge.innerHTML = getUserBadgeMarkup(currentChatUser);
    }
    if (profileTargetUser) {
      profileDisplayBadge.innerHTML = getUserBadgeMarkup(profileTargetUser);
    }
    if (privateMessagesPage.style.display !== 'none') {
      renderPrivateMessages();
    }
  }

  function renderMessages() {
    if (!currentChatUser) return;
    const msgs = messages[currentChatUser.id] || [];
    const dateDiv = document.createElement('div');
    dateDiv.className = 'messages-date';
    dateDiv.textContent = 'اليوم';
    const messageFragment = document.createDocumentFragment();
    messageFragment.appendChild(dateDiv);

    msgs.forEach((msg, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'msg-wrapper ' + (msg.from === 'me' ? 'sent' : 'received');
      if (messageAnimations.has(msg.id)) {
        wrapper.style.animationDelay = (i * 0.04) + 's';
      } else {
        wrapper.style.animation = 'none';
      }

      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble ' + (msg.from === 'me' ? 'sent' : 'received');

      const readIcon = msg.from === 'me' && msg.read
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` 
        : '';

      const messageContent = msg.mediaUrl
        ? (msg.mediaType && msg.mediaType.startsWith('video/')
          ? `<div class="media-message"><video controls playsinline src="${msg.mediaUrl}"></video><span>${msg.text}</span></div>`
          : `<div class="media-message"><img src="${msg.mediaUrl}" alt="${msg.text}"><span>${msg.text}</span></div>`)
        : msg.audioUrl
        ? `<div class="audio-message"><span>🎙️ ${msg.text}</span><audio controls src="${msg.audioUrl}"></audio></div>`
        : (msg.text || '').replace(/\n/g, '<br>');

      bubble.innerHTML = messageContent + `
        <div class="msg-time">
          ${msg.time}
          ${msg.from === 'me' ? '<span class="msg-read">' + readIcon + '</span>' : ''}
        </div>
      `;
      wrapper.appendChild(bubble);
      messageFragment.appendChild(wrapper);
    });

    messagesArea.replaceChildren(messageFragment);
    messageAnimations.clear();
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function showTyping() {
    if (isTyping) return;
    isTyping = true;
    chatStatusText.textContent = 'يكتب الآن...';
    chatStatus.classList.add('typing');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    messagesArea.appendChild(typingDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function hideTyping() {
    isTyping = false;
    chatStatusText.textContent = 'متصل الآن';
    chatStatus.classList.remove('typing');
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  }

  window._sendMessage = function() {
    const text = msgInput.value.trim();
    if (!text || !currentChatUser) return;

    const msgId = generateId();
    messages[currentChatUser.id].push({
      id: msgId, from: 'me', text: text, time: getTime(), read: false
    });
    messageAnimations.add(msgId);
    currentChatUser.msgCount++;
    totalChats++;
     if (statChats) statChats.textContent = totalChats;
    msgInput.value = '';
    renderMessages();

    setTimeout(() => {
      const msg = messages[currentChatUser.id].find(m => m.id === msgId);
      if (msg) { msg.read = true; renderMessages(); }
    }, 900);

    const reply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      showTyping();
      setTimeout(() => {
        hideTyping();
        if (currentChatUser) {
          const replyId = generateId();
          messages[currentChatUser.id].push({
            id: replyId, from: 'them', text: reply.text, time: getTime(), read: true
          });
          messageAnimations.add(replyId);
          currentChatUser.msgCount++;
          totalChats++;
           if (statChats) statChats.textContent = totalChats;
          renderMessages();
          showToast('رسالة جديدة من ' + currentChatUser.name);
        }
      }, 1800);
    }, reply.delay);
  };

  setInterval(() => {
    const action = Math.random();

    if (action < 0.28 && users.length < 16) {
      const firstName = extraNames[Math.floor(Math.random() * extraNames.length)];
      const lastName = extraNames[Math.floor(Math.random() * extraNames.length)];
      const name = firstName + ' ' + lastName;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const newUser = {
        id: userIdCounter++,
        name: name,
        initials: name.split(' ').map(n => n[0]).join(''),
        color: color,
        bio: bios[Math.floor(Math.random() * bios.length)],
        gender: Math.random() > 0.5 ? 'ذكر' : 'أنثى',
        badge: Math.random() > 0.65 ? 'new' : null,
        lastSeen: 'الآن',
        msgCount: 0,
        isNew: true,
        age: Math.floor(Math.random() * 25) + 18,
        country: countries[Math.floor(Math.random() * countries.length)],
        connectedAt: Date.now(),
        lastActivityAt: Date.now()
      };
      newUser.countryCode = newUser.country.code;
      newUser.nationality = newUser.country.name;
      users.unshift(newUser);

      const filter = searchInput.value;
      if (!isFeaturedView && (!filter || newUser.name.includes(filter))) {
        const previousPositions = new Map(
          [...usersList.querySelectorAll('.user-card')].map(card => [card, card.getBoundingClientRect()])
        );
        const card = document.createElement('div');
        card.className = 'user-card';
        card.dataset.userId = String(newUser.id);
        card.style.animation = 'none';

        const badgeHtml = getUserBadgeMarkup(newUser);

        card.innerHTML = `
          <div class="user-avatar-wrap">
            <div class="user-avatar ${newUser.gender === 'أنثى' ? 'avatar-placeholder female' : 'avatar-placeholder male'}">${getAvatarMarkup(newUser)}</div>
            <span class="user-status-dot"></span>
          </div>
          <div class="user-info">
            <div class="user-name-row">
              <span class="user-name">${newUser.name}</span>
              ${badgeHtml}
            </div>
             <div class="user-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                 ${newUser.age || '—'} سنة
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                 ${newUser.country ? newUser.country.flag : '🌍'} ${newUser.country ? newUser.country.name : 'غير محددة'}
              </span>
            </div>
          </div>
          <div class="user-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m22 2-7 20-4-9-9-4 20-7z"/>
            </svg>
          </div>
        `;
        card.querySelector('.user-avatar').addEventListener('click', (event) => {
          event.stopPropagation();
          window._openUserProfile(newUser);
        });
        card.addEventListener('click', () => openChat(newUser));

        usersList.insertBefore(card, usersList.firstChild);

        requestAnimationFrame(() => {
          usersList.querySelectorAll('.user-card').forEach(existingCard => {
            if (existingCard === card) return;
            const previousPosition = previousPositions.get(existingCard);
            if (!previousPosition) return;

            const currentPosition = existingCard.getBoundingClientRect();
            const deltaX = previousPosition.left - currentPosition.left;
            const deltaY = previousPosition.top - currentPosition.top;
            if (deltaX === 0 && deltaY === 0) return;

            existingCard.animate(
              [
                { transform: `translate(${deltaX}px, ${deltaY}px)` },
                { transform: 'translate(0, 0)' }
              ],
              {
                duration: 420,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
              }
            );
          });
        });

          if (onlineCount) onlineCount.textContent = users.filter(u =>
            u.name.includes(filter) && (!isFeaturedView || Date.now() - u.connectedAt >= featuredAfterMs)
          ).length;
      }

       setTimeout(() => { newUser.isNew = false; }, 1000);

    } else if (action > 0.78 && users.length > 4) {
      const idx = Math.floor(Math.random() * users.length);
      const removed = users.splice(idx, 1)[0];

      const cards = usersList.querySelectorAll('.user-card');
      cards.forEach(card => {
        const nameEl = card.querySelector('.user-name');
        if (nameEl && nameEl.textContent === removed.name) {
          card.style.transition = 'all 0.4s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { if (card.parentNode) card.remove(); }, 400);
        }
      });

      if (currentChatUser && currentChatUser.id === removed.id) {
        chatStatusText.textContent = 'غير متصل';
        chatStatus.style.color = '#ef4444';
      }
      refreshVipDisplays();

       if (onlineCount) onlineCount.textContent = users.filter(u =>
         u.name.includes(searchInput.value) && (!isFeaturedView || Date.now() - u.connectedAt >= featuredAfterMs)
       ).length;
     }

      const vipStateChanged = users.some(user => {
        const isFeatured = isFeaturedUser(user);
       if (user._featuredState === undefined) {
         user._featuredState = isFeatured;
         return false;
       }
       if (user._featuredState !== isFeatured) {
         user._featuredState = isFeatured;
         return true;
       }
       return false;
     });
       if (vipStateChanged) refreshVipDisplays(isFeaturedView);
  }, 5000);

  configureDrawerMenu();
  myProfile.connectedAt = initialSessionStartedAt - (65 * 60 * 1000);
  myProfile.lastActivityAt = initialSessionStartedAt;
  users.unshift(myProfile);
  restoreMyBlockedUsers();
  renderUsers();
  updateMessagesBadge();

})();
