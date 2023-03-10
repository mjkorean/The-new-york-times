const openNav = () => {
  document.getElementById("nav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("nav").style.width = "0";
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

let news = [];
let page = 1;
let total_pages = 0;

let menus = document.querySelectorAll(".menus button");

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;

// 각 함수에서 필요한 url 작성
// api 호출 함수 부른다

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "P0oEk0aswua68ewBiwWmv4lioMwirgD5Cq7yKvBJQ7g",
    });

    url.searchParams.set("page", page);
    console.log("url은?", url);

    let response = await fetch(url, { headers: header });
    let data = await response.json();

    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      console.log("받는 데이터가 뭐지?", data);
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log(news);
      render();
      pagination();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는: ", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  console.log("클릭됨", event.target.textContent);

  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  /*
  1. 검색 키워드 읽어오기
  2. url에 검색 키워드 부치기
  3. 헤더 준비
  4. url 부르기
  5. 데이터 가져오기
  6. 데이터 보여주기
  */

  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img class="news-image"
        src="${item.media}"
      />
    </div> 
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
      <div>${item.rights} * ${item.published_date}</div>
    </div>
  </div>`;
    })
    .join("");

  console.log(newsHTML);

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagination = () => {
  let paginationHTML = ``;
  // total_page
  // 내가 보고 있는 현재 page
  // page group
  let pageGroup = Math.ceil(page / 5);
  // last page
  let last = pageGroup * 5;
  // first page
  let first = last - 4;
  // first~last 페이지 프린트

  // total page < 5일 경우, 남은 페이지 수 만큼만 출력 - last, first
  // << >> 버튼 만들기 - 맨처음, 맨끝으로 가는 버튼
  // 내가 맨 처음 그룹일때 << 버튼 없음
  // 내가 맨 마지막 그룹일때 >> 버튼 없음

  paginationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
    page - 1
  })">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;

  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  paginationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
    page + 1
  })>
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`;

  document.querySelector("pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  // 이동하고싶은 페이지 알기
  page = pageNum;

  // 이동하고싶은 페이지 가지고 api 다시 호출
  getNews();
};

searchButton.addEventListener("click", getNewsByKeyword);

getLatestNews();
