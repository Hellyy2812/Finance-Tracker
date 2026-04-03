let data = JSON.parse(localStorage.getItem("data")) || [
    { cat: "salary", amt: 30000, type: "income", date: "2026-03-01" },
    { cat: "shopping", amt: 1200, type: "expense", date: "2026-03-05" },
    { cat: "Taxi", amt: 500, type: "expense", date: "2026-03-10" },
    { cat: "grocey", amt: 1500, type: "expense", date: "2026-03-12" },
    { cat: "stocks", amt: 2700, type: "income", date: "2026-03-13" },
    { cat: "coffee", amt: 200, type: "expense", date: "2026-03-14" },
    { cat: "Light bill", amt: 2200, type: "expense", date: "2026-03-31" },



  ];
  
  let filter = "all";
  
  // SUMMARY
  function showCards() {
    let inc = 0, exp = 0;
  
    data.forEach(d => {
      if (d.type === "income") inc += d.amt;
      else exp += d.amt;
    });
  
    document.getElementById("balance").innerText = "Balance ₹" + (inc - exp);
    document.getElementById("income").innerText = "Income ₹" + inc;
    document.getElementById("expenses").innerText = "Expenses ₹" + exp;
  }
  
  // list of expenses
  function showList() {
    let box = document.getElementById("list");
  
    let arr = data.filter(d => filter === "all" || d.type === filter);
  
    let html = "";
  
    arr.forEach(d => {
      html += `
        <div class="item">
          <span>${d.cat}</span>
          <span>₹${d.amt}</span>
        </div>
      `;
    });
  
    box.innerHTML = html || "no data";
  }
  
  // adding data by admin
  function addData() {
    let c = document.getElementById("cat").value;
    let a = document.getElementById("amt").value;
    let t = document.getElementById("type").value;
  
    data.push({
      cat: c,
      amt: Number(a),
      type: t,
      date: "2026-04-01"
    });
  
    localStorage.setItem("data", JSON.stringify(data));
    loadAll();
  }
  
  // INSIGHT
//   function showInsight() {
//     let obj = {};
  
//     data.forEach(d => {
//       if (d.type === "expense") {
//         obj[d.cat] = (obj[d.cat] || 0) + d.amt;
//       }
//     });
  
//     let max = Object.keys(obj).reduce((a, b) =>
//       obj[a] > obj[b] ? a : b, Object.keys(obj)[0]
//     );
  
//     document.getElementById("insightText").innerText =
//       "most spent on " + (max || "none");
//   }

function showInsight() {
    let totalExp = 0;
    let totalInc = 0;
    let catObj = {};
  
    data.forEach(d => {
      if (d.type === "expense") {
        totalExp += d.amt;
        catObj[d.cat] = (catObj[d.cat] || 0) + d.amt;
      } else {
        totalInc += d.amt;
      }
    });
  
    // highest category
    let maxCat = "none";
    let maxVal = 0;
  
    for (let key in catObj) {
      if (catObj[key] > maxVal) {
        maxVal = catObj[key];
        maxCat = key;
      }
    }
  
    // avg spending
    let avg = data.length ? Math.round(totalExp / data.length) : 0;
  
    // saving status
    let status = totalInc > totalExp ? "saving " : "overspending ";
  
    document.getElementById("insightText").innerHTML = `
      <p>Total spent: ₹${totalExp}</p>
      <p>Total income: ₹${totalInc}</p>
      <p>Highest category: ${maxCat}</p>
      <p> Avg expense: ₹${avg}</p>
      <p> Status: ${status}</p>
    `;
  }
  
  // Chart
  let lineChart, pieChart;
  
  function makeCharts() {
    let dates = data.map(d => d.date);
    let amounts = data.map(d => d.amt);
  
    if (lineChart) lineChart.destroy();
  
    lineChart = new Chart(document.getElementById("lineChart"), {
      type: "line",
      data: {
        labels: dates,
        datasets: [{
          label: "spending",
          data: amounts,
          borderColor: "#3b82f6",
          fill: false
        }]
      }
    });
  
    let catObj = {};
    data.forEach(d => {
      if (d.type === "expense") {
        catObj[d.cat] = (catObj[d.cat] || 0) + d.amt;
      }
    });
  
    if (pieChart) pieChart.destroy();
  
    pieChart = new Chart(document.getElementById("pieChart"), {
      type: "doughnut",
      data: {
        labels: Object.keys(catObj),
        datasets: [{
          data: Object.values(catObj),
          backgroundColor: ["#FF88BA", "#FF9760", "#8CC7C4", "#DD7BDF", "#77BEF0"]
        }]
      }
    });
  }
  
  // Filter
  document.getElementById("filter").addEventListener("change", (e) => {
    filter = e.target.value;
    showList();
  });
  
  // ROLE
  document.getElementById("roleToggle").addEventListener("change", (e) => {
    let role = e.target.value;
    document.getElementById("formBox").style.display =
      role === "admin" ? "block" : "none";
  });

  // //secShows
  // function showSection(id){
  //   let sections = ["dashboardSection", "transSection", "insightSection"];
  //   for (let i = 0; i < sections.length; i++){
  //       document.getElementById(sections[i]).style.display = "none";
  //   }
  //   document.getElementById(id).style.display = "block";
  // }
  
  // LOAD
  function loadAll() {
    showCards();
    showList();
    showInsight();
    makeCharts();
  }
  
  loadAll();

