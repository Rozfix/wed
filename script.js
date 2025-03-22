async function fetchData() {
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbxk44rOMGmIGXimFRObsNOLozRhjoLZ1l6HtQOnhgAVdYL8QfhFjr-q5GUr9lvrJxTZLQ/exec";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Получаем ID из URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchID = urlParams.get("id1");
    const searchID2 = urlParams.get("id2");
    console.log(searchID);

    if (!searchID && !searchID2) {
      console.log("Введите ID в URL (например, ?id1=101)");
      return;
    }
    // Find name by ID
    const foundEntry = data.find((entry) => entry.id == searchID);
    const foundEntry2 = data.find((entry) => entry.id == searchID2);
    console.log(foundEntry);
    console.log(foundEntry2);
    var text;

    if (!foundEntry2) {
      text = `${foundEntry.name}`;
    } else {
      text = `${foundEntry.name} <span class="union">и</span> ${foundEntry2.name}`;
    }
    document.getElementById("names").innerHTML = text;
  } catch (error) {
    document.getElementById("names").innerText = "Ошибка загрузки данных";
    console.error("Ошибка:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth < 768) {
    var toggleBtnMarginTop = "5px";
    var toggleBtnMarginRight = "60px";
    var toggleBtnMarginRight2 = "0px";
    var toggleBtnPaddingBottom = "15px";
  }

  var staticDate = document.getElementById("static-date");
  const countdownBlock = document.getElementById("countdown");
  var toggleBtn = document.getElementById("toggle-countdown");
  const modal = document.getElementById("modalWindow");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.querySelector(".close");
  const dateSelector = document.querySelector(".date");

  var daysEl = document.getElementById("days");
  var hoursEl = document.getElementById("hours");
  var minutesEl = document.getElementById("minutes");
  var secondsEl = document.getElementById("seconds");

  let isCountdownVisible = false;

  toggleBtn.addEventListener("click", function () {
    isCountdownVisible = !isCountdownVisible;

    if (isCountdownVisible) {
      staticDate.style.display = "none";
      countdownBlock.style.display = "block";
      toggleBtn.innerText = "date_range"; // Иконка календаря
      toggleBtn.style.marginTop = toggleBtnMarginTop;
      toggleBtn.style.marginRight = toggleBtnMarginRight;
      dateSelector.style.paddingBottom = toggleBtnPaddingBottom;
    } else {
      staticDate.style.display = "block";
      countdownBlock.style.display = "none";

      toggleBtn.innerText = "history"; // Иконка часов
      toggleBtn.style.marginTop = toggleBtnMarginTop;
      toggleBtn.style.marginRight = toggleBtnMarginRight2;
    }
  });

  function replaceElements() {
    let gpsIcon = document.getElementById("gps"); // Родительский контейнер
    if (!gpsIcon) return; // Если контейнера нет, выходим

    if (window.innerWidth < 768) {
      gpsIcon.remove(); // Удаляем первый элемент в коллекции (оставшиеся сдвигаются)
    }
  }

  fetchData();

  replaceElements();

  // Count down timer
  function countdownTimer() {
    const countDownDate = new Date("06/07/2025").getTime();
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance <= 0) {
      clearInterval(interval);
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minutesEl.innerText = "00";
      secondsEl.innerText = "00";
      return;
    }
    daysEl.innerText = formatNumber(Math.floor(distance / day));
    hoursEl.innerText = formatNumber(Math.floor((distance % day) / hour));
    minutesEl.innerText = formatNumber(Math.floor((distance % hour) / minute));
    secondsEl.innerText = formatNumber(Math.floor((distance % minute) / second));
  }
  countdownTimer();
  const interval = setInterval(countdownTimer, 1000);
  function formatNumber(number) {
    if (number < 10) {
      return "0" + number;
    }
    return number;
  }
  countdownTimer();

  // Open modal window
  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal window
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close when to click by outside window
  // window.addEventListener("click", (event) => {
  //   if (event.target === modal) {
  //     modal.style.display = "none";
  //   }
  // });

  document.getElementById("allergyCheckbox").addEventListener("change", function () {
    if (document.getElementById("allergyCheckbox").checked) {
      document.getElementById("allergyInput").style.display = "block"; // Показываем поле
    }
  });
  document.getElementById("noAllergy").addEventListener("change", function () {
    if (document.getElementById("noAllergy").checked) {
      document.getElementById("allergyInput").style.display = "none"; // Скрываем поле
      document.getElementById("allergyInput").value = ""; // Очищаем поле
    }
  });

  // Form submission handler

  document.getElementById("submit").addEventListener("click", async function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id1");
    const id2 = urlParams.get("id2");

    if (!id && !id2) {
      alert("Ошибка: ID не указан в URL!");
      return;
    }

    const attend = document.querySelector('input[name="attend"]:checked')?.id || "Не указано";
    const drinks = [...document.querySelectorAll('input[name="drink"]:checked')].map((el) => el.value);
    const allergy =
      document.querySelector('input[name="allergy"]:checked')?.id === "allergyCheckbox"
        ? document.getElementById("allergyInput").value
        : "Нет";

    const data = { id, id2, attend, drink: drinks, allergy };

    const apiUrl =
      "https://script.google.com/macros/s/AKfycbxy9a_F_FcpAZKwDHT89U96SFVqdnPdYawgdMy70N6S_6tuNY2kFrOcCCzFddSEiwRgGA/exec";
    toggleBtn.click();
    modal.style.display = "none";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
      });

      alert("Ответ записан!");
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось отправить данные");
    }
  });
});
