// Load CSV and initialize the dashboard
fetch("Electric_Vehicle_Population_Data.csv")
  .then((response) => response.text())
  .then((csvData) => {
    const data = parseCSV(csvData);
    createVisualizations(data);
  })
  .catch((error) => console.error("Error loading CSV file:", error));

// Parse CSV content into an array of objects
function parseCSV(csv) {
  const lines = csv.split("\n").filter(Boolean);
  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index].trim();
      return obj;
    }, {});
  });
  return rows;
}

// Create visualizations
function createVisualizations(data) {
  // Aggregate data by Make
  const makeCounts = data.reduce((acc, row) => {
    const make = row["Make"];
    acc[make] = (acc[make] || 0) + 1;
    return acc;
  }, {});

  // Aggregate data by Electric Vehicle Type
  const typeCounts = data.reduce((acc, row) => {
    const type = row["Electric Vehicle Type"];
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Extract Electric Ranges
  const ranges = data
    .map((row) => Number(row["Electric Range"] || 0))
    .filter(Boolean);

  // Create Charts
  createMakeChart(makeCounts);
  createTypeChart(typeCounts);
  createRangeChart(ranges);
}

// Chart.js - Create Make Distribution Chart
function createMakeChart(makeCounts) {
  const ctx1 = document.getElementById("makeChart").getContext("2d");
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels: Object.keys(makeCounts),
      datasets: [
        {
          label: "EVs by Make",
          data: Object.values(makeCounts),
          backgroundColor: "#4CAF50",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  });
}

// Chart.js - Create Type Distribution Chart
function createTypeChart(typeCounts) {
  const ctx2 = document.getElementById("typeChart").getContext("2d");
  new Chart(ctx2, {
    type: "pie",
    data: {
      labels: Object.keys(typeCounts),
      datasets: [
        {
          label: "EVs by Type",
          data: Object.values(typeCounts),
          backgroundColor: ["#673AB7", "#3F51B5", "#009688", "#E91E63"],
        },
      ],
    },
    options: { responsive: true },
  });
}

// Chart.js - Create Electric Range Chart
function createRangeChart(ranges) {
  const ctx3 = document.getElementById("rangeChart").getContext("2d");
  new Chart(ctx3, {
    type: "line",
    data: {
      labels: ranges.map((_, i) => `Vehicle ${i + 1}`),
      datasets: [
        {
          label: "Electric Range (miles)",
          data: ranges,
          borderColor: "#FF9800",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
    },
  });
}
