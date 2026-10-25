// ======
// ヘッダー固定
// ======
const trigger = document.querySelector(".header-trigger");
const header = document.querySelector(".header");

function checkHeader() {
  const triggerTop = trigger.getBoundingClientRect().bottom;

  if (triggerTop <= 0) {
    header.classList.add("fix");
  } else {
    header.classList.remove("fix");
  }
}

window.addEventListener("scroll", checkHeader);
window.addEventListener("resize", checkHeader);

checkHeader();
// =========
// JSON engine
// =========

let jsonData = null;

function loadJson(file) {
  fetch(file)
    .then((response) => {
      if (!response.ok) {
        throw new Error("JSONを読み込めませんでした: " + file);
      }

      return response.json();
    })
    .then((data) => {
      jsonData = data;

      // JSON読み込み完了
      main();
    })
    .catch((error) => {
      console.error(error);
    });
}

/*
    getJsonS(file, type)
    1 = 合計プロジェクト数
    2 = アクティブ数
    3 = インアクティブ数
    4 = フィニッシュ数
*/

function getJsonS(file, type) {
  if (!jsonData) {
    throw new Error("先に loadJson() を実行してください");
  }

  const projects = jsonData.projects;

  switch (type) {
    case 1:
      return projects.length;

    case 2:
      return projects.filter((p) => p.status === "active").length;

    case 3:
      return projects.filter((p) => p.status === "inactive").length;

    case 4:
      return projects.filter((p) => p.status === "finished").length;

    default:
      throw new Error("getJsonS: typeが不正です");
  }
}

/*
    getJsonI(file, index)
    指定したプロジェクトの情報を取得
*/

function getJsonI(file, index) {
  if (!jsonData) {
    throw new Error("先に loadJson() を実行してください");
  }

  const project = jsonData.projects[index];

  if (!project) {
    throw new Error("指定されたプロジェクトが存在しません");
  }

  return {
    title: project.title,
    progress: project.progress,
    textA: project.textA,
    textB: project.textB,

    linkn: project.links ? project.links.length : 0,
    link: project.links || [],

    imgn: project.images ? project.images.length : 0,
    img: project.images || [],
  };
}

function showProjects(status) {
  const list = document.getElementById("project-list");
  const template = document.getElementById("project-template");

  // 以前のカードを削除
  list
    .querySelectorAll(".project-card:not(#project-template)")
    .forEach((card) => card.remove());

  // 以前のメッセージを削除
  const oldMessage = list.querySelector(".empty-message");
  if (oldMessage) {
    oldMessage.remove();
  }

  // 対象プロジェクト
  const projects = jsonData.projects.filter(
    (project) => project.status === status,
  );

  // プロジェクトが0件の場合
  if (projects.length === 0) {
    const message = document.createElement("p");

    message.className = "empty-message";
    message.textContent = "ﾏﾀﾞﾅｲﾖ";

    list.appendChild(message);
    return;
  }

  // プロジェクトが存在する場合
  projects.forEach((project) => {
    // 見本をコピー
    const card = template.cloneNode(true);

    // IDは複製しない
    card.removeAttribute("id");

    // 表示
    card.style.display = "";

    // 内容を書き換える
    card.querySelector(".project-title").textContent = project.title;
    card.querySelector(".project-percent").textContent = project.progress + "%";
    card.querySelector(".project-text").textContent = project.textA;
    card.querySelector(".progress-bar").style.width = project.progress + "%";

    // 追加
    list.appendChild(card);
  });
}

// ======
// 本体
// ======

function main() {
  console.log(getJsonS("projects.json", 1));
  console.log(getJsonS("projects.json", 2));
  console.log(getJsonS("projects.json", 3));
  console.log(getJsonS("projects.json", 4));

  const project = getJsonI("projects.json", 0);

  console.log(project.title);
  console.log(project.progress);
  console.log(project.textA);
  console.log(project.textB);
  console.log(project.linkn);
  console.log(project.link);
  console.log(project.imgn);
  console.log(project.img);
  showProjects("active");
  document
    .querySelector('.project-tabs button[data-status="active"]')
    .classList.add("active-tab");
}

// JSON読み込み開始
loadJson("projects.json");
document.querySelectorAll(".project-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    const status = button.dataset.status;

    // 指定されたステータスのプロジェクトを表示
    showProjects(status);
  });
});

document.querySelectorAll(".project-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    const status = button.dataset.status;

    showProjects(status);

    // すべてのボタンから選択状態を解除
    document.querySelectorAll(".project-tabs button").forEach((btn) => {
      btn.classList.remove("active-tab");
    });

    // 押したボタンだけ選択状態にする
    button.classList.add("active-tab");
  });
});
