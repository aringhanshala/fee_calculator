document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      // Remove previous receipt if it exists
      const oldReceipt = document.getElementById("receipt-container");
      if (oldReceipt) oldReceipt.remove();
  
      // Hide the fee calculator box
      document.querySelector(".fee").style.display = "none";
  
      // Collect form data
      const name = document.getElementById("name").value;
      const gender = document.querySelector('input[name="gender"]:checked')?.value;
      const branch = document.getElementById("course").value.toUpperCase();
      const marks = parseFloat(document.getElementById("marks").value);
      const exam = document.getElementById("exam").value.toLowerCase();
      const score = parseFloat(document.getElementById("score").value);
  
      const uk_domicile = document.querySelector('input[name="uk_domicile"]:checked')?.value === "yes";
      const single_parent = document.querySelector('input[name="single_parent"]:checked')?.value === "yes";
      const defense_ward = document.querySelector('input[name="defense_ward"]:checked')?.value === "yes";
      const siblings = document.querySelector('input[name="siblings"]:checked')?.value === "yes";

      const is_female = gender?.toLowerCase() === "female";
  
      const branches = {
        "BTECH": 190000,
        "BCA": 150000,
        "B.SC": 140000,
        "MBA": 250000,
      };
  
      const base_fee = branches[branch];
      if (!base_fee) return alert("Invalid course selected.");
  
      // Scholarships
      let academic_scholarship = 0;
      const branch_scholarships = {
        "BTECH": [[95, 99, 45000], [90, 98.5, 40000], [85, 97, 35000], [80, 94, 30000], [75, 92, 25000], [70, 90, 6000]],
        "BCA": [[95, 45000], [90, 40000], [85, 35000], [80, 30000], [75, 25000], [70, 6000]],
        "B.SC": [[92, 35000], [87, 30000], [82, 25000], [77, 20000], [72, 15000], [67, 4000]],
        "MBA": [[90, 95, 85, 90, 50000], [85, 90, 80, 85, 45000], [80, 85, 75, 80, 40000], [75, 80, 70, 75, 35000], [70, 75, 65, 70, 30000], [65, 70, 60, 65, 10000]],
      };
  
      const sch = branch_scholarships[branch];
      if (branch === "BTECH") {
        for (let [min12, minJee, amount] of sch) {
          if (marks >= min12 || score >= minJee) {
            academic_scholarship = amount;
            break;
          }
        }
      } else if (branch === "MBA") {
        for (let [min12, cuet, cat, cmat, amount] of sch) {
          if (marks >= min12 || score >= cuet || score >= cat || score >= cmat) {
            academic_scholarship = amount;
            break;
          }
        }
      } else {
        for (let [min12, amount] of sch) {
          if (marks >= min12 || score >= min12) {
            academic_scholarship = amount;
            break;
          }
        }
      }
  
      const scholarships = {
        "Academic Scholarship": academic_scholarship,
        "Uttarakhand Domicile Scholarship": uk_domicile ? 0.25 : 0,
        "Single Parent Scholarship": single_parent ? 0.05 : 0,
        "Defense Personnel Ward Scholarship": defense_ward ? 0.05 : 0,
        "Female Student Scholarship": is_female ? 0.1 : 0,
      };
  
      const total_percent_discount = Object.entries(scholarships)
        .filter(([k]) => k !== "Academic Scholarship")
        .reduce((sum, [_, val]) => sum + val, 0);
  
      const discount = base_fee * total_percent_discount;
      const gross_fee = base_fee - discount - academic_scholarship;
  
      const full_year = confirm("Do you want to pay full year fee?");
      let discounted_yearly_fee = null;
      let new_semester_fee = gross_fee;
  
      if (full_year) {
        const yearly_fee = gross_fee * 2;
        discounted_yearly_fee = yearly_fee * 0.95;
        new_semester_fee = discounted_yearly_fee / 2;
      }
  
      const one_time_charges = 18000;
      const other_yearly = 23500;
  
      // Receipt container
      const receiptContainer = document.createElement("div");
      receiptContainer.id = "receipt-container";
      receiptContainer.style.position = "absolute";
      receiptContainer.style.top = "50%";
      receiptContainer.style.left = "50%";
      receiptContainer.style.transform = "translate(-50%, -50%)";
      receiptContainer.style.marginTop="275px";
      receiptContainer.style.maxWidth = "750px";
      receiptContainer.style.width = "90%";
      receiptContainer.style.padding = "30px";
      receiptContainer.style.background = "rgba(255, 255, 255, 0.9)";
      receiptContainer.style.borderRadius = "16px";
      receiptContainer.style.boxShadow = "0 0 25px rgba(0, 0, 0, 0.2)";
      receiptContainer.style.fontFamily = "Arial, sans-serif";
      receiptContainer.style.lineHeight = "1.6";
      receiptContainer.style.textAlign = "left";
      receiptContainer.style.zIndex = "10";
      receiptContainer.style.backdropFilter = "blur(8px)";
      

  
      receiptContainer.innerHTML = `
        <h2 style="text-align: center; color: crimson;">🎓 Fee Receipt - Graphic Era Hill University</h2>
        <hr style="margin: 20px 0;">
        <p><strong>👤 Name:</strong> ${name}</p>
        <p><strong>🎓 Course:</strong> ${branch}</p>
        <p><strong>💰 Base Semester Fee:</strong> Rs. ${base_fee}</p>
        <h3 style="color: #2c3e50;">📌 Scholarships Applied:</h3>
        <ul>
          ${Object.entries(scholarships)
            .filter(([_, v]) => v)
            .map(([k, v]) => `<li>${k}: ${k === "Academic Scholarship" ? `Rs. ${v}` : `${v * 100}%`}</li>`)
            .join("")}
        </ul>
        <p><strong>🧾 Gross Tuition Fee (1st Semester):</strong> Rs. ${gross_fee.toFixed(2)}</p>
        ${full_year ? `
          <p><strong>📉 Discounted Semester Fee (Full Year Payment):</strong> Rs. ${new_semester_fee.toFixed(2)}</p>
          <p><strong>📆 Gross Yearly Fee (After 5% Discount):</strong> Rs. ${discounted_yearly_fee.toFixed(2)}</p>
        ` : ""}
        <h3 style="color: #2c3e50;">🧾 One-Time Charges</h3>
        <ul>
          <li>Admission Fee: Rs. 10,000</li>
          <li>Enrollment Fee: Rs. 3,000</li>
          <li>Caution Money (Refundable): Rs. 5,000</li>
          <li><strong>Total:</strong> Rs. ${one_time_charges}</li>
        </ul>
        <p><strong>📊 Other Yearly Charges:</strong> Rs. ${other_yearly}</p>
        <hr style="margin: 20px 0;">
        <h3 style="color: green;">💸 Total Payable Now (including One-Time): Rs. ${(new_semester_fee + one_time_charges).toFixed(2)}</h3>
        <p style="text-align: center; margin-top: 30px;">✅ <em>Thank you for using the Fee Calculator.</em></p>
      `;
  
      document.body.appendChild(receiptContainer);
     // window.scrollTo({ top: receiptContainer.offsetTop - 300, behavior: "smooth" });
    });
  });
  