
let selectedRoomPrice = 0;
let currentNights = 0;


const bookedDates = [
    "2026-11-04",
    "2026-11-05",
    "2026-11-12",
    "2026-11-13",
    "2026-11-18",
    "2026-11-25"
];


window.addEventListener("DOMContentLoaded", function () {
    setupDateInputs();
    renderCalendar();
});

 
function setupDateInputs() {
    const checkInInput = document.getElementById("checkInDate");
    const checkOutInput = document.getElementById("checkOutDate");

    // Set minimum selectable date to today's date
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];

    checkInInput.min = formattedToday;
    checkOutInput.min = formattedToday;
}

function selectRoom(roomName, price) {
    const roomSelect = document.getElementById("roomType");
    roomSelect.value = roomName;
    selectedRoomPrice = price;

    // Smooth scroll down to the booking form
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" });
    }

    calculateCharges();
}

// When room dropdown changes
function handleRoomChange() {
    const roomSelect = document.getElementById("roomType");
    const selectedOption = roomSelect.options[roomSelect.selectedIndex];

    if (selectedOption.value !== "") {
        selectedRoomPrice = parseInt(selectedOption.getAttribute("data-price"), 10);
    } else {
        selectedRoomPrice = 0;
    }

    calculateCharges();
}

function calculateCharges() {
    const checkInVal = document.getElementById("checkInDate").value;
    const checkOutVal = document.getElementById("checkOutDate").value;
    const roomSelect = document.getElementById("roomType");
    const selectedRoomName = roomSelect.value || "Not Selected";

    // Summary elements
    const summaryRoom = document.getElementById("summaryRoom");
    const summaryRate = document.getElementById("summaryRate");
    const summaryNights = document.getElementById("summaryNights");
    const summaryRoomCost = document.getElementById("summaryRoomCost");
    const summaryMealCost = document.getElementById("summaryMealCost");
    const summaryTotalAmount = document.getElementById("summaryTotalAmount");

    // Get selected meal price from radio buttons
    const mealRadios = document.getElementsByName("mealPlan");
    let mealPricePerDay = 0;
    for (let i = 0; i < mealRadios.length; i++) {
        if (mealRadios[i].checked) {
            mealPricePerDay = parseInt(mealRadios[i].value, 10);
            break;
        }
    }

    // Default calculations
    currentNights = 0;
    let roomCost = 0;
    let mealCost = 0;
    let totalCost = 0;

    // Check if dates are selected
    if (checkInVal && checkOutVal) {
        const checkInDate = new Date(checkInVal);
        const checkOutDate = new Date(checkOutVal);

        const diffTime = checkOutDate - checkInDate;
        
        // Convert milliseconds to days (1000 * 60 * 60 * 24)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            alert("Check-out date must be at least 1 day after Check-in date.");
            document.getElementById("checkOutDate").value = "";
            currentNights = 0;
        } else {
            currentNights = diffDays;
        }
    }

    // Calculations
    roomCost = currentNights * selectedRoomPrice;
    mealCost = currentNights * mealPricePerDay;
    totalCost = roomCost + mealCost;

    // Update UI Summary Card
    summaryRoom.textContent = selectedRoomName;
    summaryRate.textContent = "₹" + selectedRoomPrice + " / night";
    summaryNights.textContent = currentNights + " Night(s)";
    summaryRoomCost.textContent = "₹" + roomCost;
    summaryMealCost.textContent = "₹" + mealCost;
    summaryTotalAmount.textContent = "₹" + totalCost;
}

// Reset calculation on form reset
function resetCalculation() {
    selectedRoomPrice = 0;
    currentNights = 0;
    setTimeout(calculateCharges, 50);
}

/* ==========================================
   4. Room Availability Calendar (November 2026)
   ========================================== */
function renderCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = "";

    // Month details: November 2026 has 30 days
    // 1st November 2026 is a Sunday (index 0)
    const year = 2026;
    const month = 10; // 0-indexed (10 = November)
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday = 0
    const totalDaysInMonth = 30;

    // Add empty placeholder cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "cal-day empty";
        calendarGrid.appendChild(emptyCell);
    }

    // Add days of the month (1 to 30)
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.className = "cal-day";

        // Format day string to YYYY-MM-DD
        const dayString = `${year}-11-${day < 10 ? '0' + day : day}`;
        dayCell.textContent = day;

        // Check if date is booked or open
        if (bookedDates.includes(dayString)) {
            dayCell.classList.add("status-booked");
            dayCell.title = "Booked / Unavailable";
        } else {
            dayCell.classList.add("status-open");
            dayCell.title = "Available! Click to set check-in date";

            // Click listener: Select as check-in date
            dayCell.addEventListener("click", function () {
                document.getElementById("checkInDate").value = dayString;

                // Auto suggest next day as check-out
                const nextDay = day + 1;
                if (nextDay <= totalDaysInMonth) {
                    const nextDayStr = `${year}-11-${nextDay < 10 ? '0' + nextDay : nextDay}`;
                    document.getElementById("checkOutDate").value = nextDayStr;
                }

                calculateCharges();
                alert(`Selected ${dayString} as your Check-in date.`);
            });
        }

        calendarGrid.appendChild(dayCell);
    }
}

/* ==========================================
   5. Form Submission & Confirmation Modal
   ========================================== */
function handleBookingSubmit(event) {
    event.preventDefault(); // Prevent standard page reload

    const roomType = document.getElementById("roomType").value;
    const checkIn = document.getElementById("checkInDate").value;
    const checkOut = document.getElementById("checkOutDate").value;
    const parentName = document.getElementById("parentName").value;
    const parentContact = document.getElementById("parentContact").value;
    const idProofType = document.getElementById("idProofType").value;
    const idProofNumber = document.getElementById("idProofNumber").value;
    const studentName = document.getElementById("studentName").value;
    const studentRoll = document.getElementById("studentRoll").value;

    if (!roomType) {
        alert("Please select a Room Type.");
        return;
    }

    if (currentNights <= 0) {
        alert("Please select valid Check-in and Check-out dates.");
        return;
    }

    // Generate random booking reference id
    const bookingRef = "LPU-GH-" + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = document.getElementById("summaryTotalAmount").textContent;

    // Fill the modal receipt ticket
    const ticketBox = document.getElementById("ticketDetails");
    ticketBox.innerHTML = `
        <p><strong>Booking Reference:</strong> <span style="color:#b23a3a; font-weight:bold;">${bookingRef}</span></p>
        <p><strong>Parent / Visitor Name:</strong> ${parentName}</p>
        <p><strong>Mobile Number:</strong> ${parentContact}</p>
        <p><strong>ID Proof:</strong> ${idProofType} (${idProofNumber})</p>
        <p><strong>Student Name & Roll No:</strong> ${studentName} (Reg: ${studentRoll})</p>
        <p><strong>Room Category:</strong> ${roomType}</p>
        <p><strong>Stay Duration:</strong> ${checkIn} to ${checkOut} (${currentNights} Night(s))</p>
        <p><strong>Total Estimated Bill:</strong> <strong>${totalAmount}</strong></p>
    `;

    // Display modal
    const modal = document.getElementById("confirmationModal");
    modal.style.display = "flex";
}

// Close confirmation modal
function closeModal() {
    const modal = document.getElementById("confirmationModal");
    modal.style.display = "none";
}

// Close modal if user clicks outside modal content
window.onclick = function (event) {
    const modal = document.getElementById("confirmationModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
