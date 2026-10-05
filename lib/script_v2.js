/* 1. 모바일 메뉴 */
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '메뉴 열기');
  });
});

/* 2. 프로젝트 상세 내용: 글을 바꾸려면 여기의 항목을 수정하세요. */
const projects = {
  maeum: {
    category: 'RASPBERRY PI · WEB APP', title: '마음 봄',
    details: [
      ['주요 기능', '감정과 일상을 돌아볼 수 있도록 구성한 웹앱입니다.'],
      ['사용 기술', 'Python, Raspberry Pi, 웹 인터페이스'],
      ['구현 경험', '하드웨어와 웹 기능을 연결하고 사용자 흐름을 설계했습니다.']
    ]
  },
  news: {
    category: 'AI LITERACY · CURATION', title: 'AI 뉴스 큐레이션 웹앱',
    details: [
      ['주요 기능', 'AI 관련 뉴스를 모아 카드 형식으로 보여줍니다.'],
      ['사용 기술', 'Python, Streamlit, 뉴스 카드 템플릿'],
      ['구현 경험', '수집한 정보를 읽기 쉬운 화면으로 정리했습니다.']
    ]
  },
  hangman: {
    category: 'GAME · INTERACTION', title: '손글씨 행맨',
    details: [
      ['주요 기능', '캔버스에 글자를 직접 써서 단어를 맞히는 게임입니다.'],
      ['사용 기술', 'Python, Streamlit, streamlit-drawable-canvas, Pillow, NumPy'],
      ['문제와 해결', 'Streamlit에서 이미지 경로가 표시되지 않아 정적 파일 경로로 옮겨 제공했습니다.']
    ]
  },
  iot: {
    category: 'ARDUINO · IOT', title: 'IoT 대시보드',
    details: [
      ['주요 기능', '초음파 센서값을 확인하고 LED와 모터를 제어합니다.'],
      ['사용 기술', 'Arduino UNO R4 WiFi, MQTT, Python, Streamlit'],
      ['구현 경험', '센서 데이터와 제어 신호를 발행·구독 방식으로 연결했습니다.']
    ]
  }
};

/* 3. 프로젝트 팝업 열기와 닫기 */
const dialog = document.querySelector('#project-dialog');
const detailContainer = document.querySelector('#dialog-details');
document.querySelectorAll('[data-project]').forEach(card => {
  card.addEventListener('click', () => {
    const project = projects[card.dataset.project];
    document.querySelector('#dialog-category').textContent = project.category;
    document.querySelector('#dialog-title').textContent = project.title;
    detailContainer.replaceChildren();
    project.details.forEach(([heading, description]) => {
      const headingElement = document.createElement('h3');
      const descriptionElement = document.createElement('p');
      headingElement.textContent = heading;
      descriptionElement.textContent = description;
      detailContainer.append(headingElement, descriptionElement);
    });
    dialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

/* 3-1. 프로젝트 목록을 누르거나 올리면 오른쪽 미리보기 변경 */
const projectTabs = document.querySelectorAll('.project-tab');
const projectPanes = document.querySelectorAll('.project-pane');
function selectProject(name) {
  projectTabs.forEach(tab => {
    const isOn = tab.dataset.preview === name;
    tab.classList.toggle('is-active', isOn);
    if (isOn) tab.setAttribute('aria-current', 'true');
    else tab.removeAttribute('aria-current');
  });
  projectPanes.forEach(pane => { pane.hidden = pane.dataset.pane !== name; });
}
projectTabs.forEach(tab => {
  ['click', 'mouseenter', 'focus'].forEach(type => {
    tab.addEventListener(type, () => selectProject(tab.dataset.preview));
  });
});

/* 4. 푸터 연도 */
document.querySelector('#year').textContent = new Date().getFullYear();

/* 5. 스크롤 위치에 따라 TOP 버튼 표시, 클릭하면 맨 위로 이동 */
const topButton = document.querySelector('#back-to-top');
function updateTopButton() {
  topButton.classList.toggle('is-visible', window.scrollY > 280);
}
window.addEventListener('scroll', updateTopButton, { passive: true });
updateTopButton();
topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* 6. 화면에 보이는 섹션을 왼쪽 메뉴에 표시 */
const observedSections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.querySelectorAll('a').forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
  });
}, { rootMargin: '-15% 0px -60% 0px', threshold: [0, .1, .3] });
observedSections.forEach(section => sectionObserver.observe(section));
