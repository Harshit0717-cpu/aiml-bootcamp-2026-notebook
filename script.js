const todayElement = document.getElementById("today");

todayElement.innerText = new Date().toDateString();

async function loadDashboard() {

    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/dashboard_summary`,
            {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();

        document.getElementById("todayOrders").innerText =
            data.todayOrders;

        document.getElementById("todayRevenue").innerText =
            "₹ " + Number(data.todayRevenue).toLocaleString();

        document.getElementById("monthlyOrders").innerText =
            data.monthlyOrders;

        document.getElementById("monthlyRevenue").innerText =
            "₹ " + Number(data.monthlyRevenue).toLocaleString();

    }
    catch (err) {

        console.error(err);

        alert("Unable to load dashboard data");

    }

}
async function loadLeaderboard() {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/leaderboard`,
        {
            method: "POST",
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    const tbody = document.getElementById("leaderboardBody");

    tbody.innerHTML = "";

    data.forEach((user) => {

        tbody.innerHTML += `
        <tr>
            <td>${user.name}</td>
            <td>${user.orders}</td>
            <td>₹ ${Number(user.revenue).toLocaleString()}</td>
        </tr>
        `;

    });

}
async function loadDestinations() {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/top_destinations`,
        {
            method: "POST",
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    const list = document.getElementById("destinationList");

    list.innerHTML = "";

    data.forEach(item => {

        list.innerHTML += `
        <div class="destination-item">
            <span>${item.destination}</span>
            <span>${item.orders}</span>
        </div>
        `;

    });

}
async function loadCharts() {

    const headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json"
    };

    // Daily Revenue
    const dailyResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/daily_revenue`,
        {
            method: "POST",
            headers
        }
    );

    const dailyData = await dailyResponse.json();

    new Chart(document.getElementById("dailyChart"),{

        type:"line",

        data:{
            labels:dailyData.map(x=>x.day),
            datasets:[{
                label:"Revenue",
                data:dailyData.map(x=>x.revenue),
                borderColor:"#ff6b00",
                backgroundColor:"rgba(255,107,0,0.2)",
                fill:true,
                tension:.4
            }]
        },

        options:{
            responsive:true,
            maintainAspectRatio:false
        }

    });


    // Monthly Revenue

    const monthlyResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/monthly_revenue`,
        {
            method:"POST",
            headers
        }
    );

    const monthlyData = await monthlyResponse.json();

    new Chart(document.getElementById("monthlyChart"),{

        type:"bar",

        data:{
            labels:monthlyData.map(x=>x.month),
            datasets:[{
                label:"Revenue",
                data:monthlyData.map(x=>x.revenue)
            }]
        },

        options:{
            responsive:true,
            maintainAspectRatio:false
        }

    });

}
function downloadCSV(){

    let csv = "Metric,Value\n";

    csv += `Today's Orders,${document.getElementById("todayOrders").innerText}\n`;
    csv += `Today's Revenue,${document.getElementById("todayRevenue").innerText}\n`;
    csv += `Monthly Orders,${document.getElementById("monthlyOrders").innerText}\n`;
    csv += `Monthly Revenue,${document.getElementById("monthlyRevenue").innerText}\n`;

    const blob = new Blob([csv],{type:"text/csv"});

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "dashboard_summary.csv";

    a.click();

    URL.revokeObjectURL(url);

}
document.getElementById("todayOrders").innerText = "...";
document.getElementById("todayRevenue").innerText = "...";
document.getElementById("monthlyOrders").innerText = "...";
document.getElementById("monthlyRevenue").innerText = "...";
loadDashboard();
loadLeaderboard();
loadDestinations();
loadCharts();