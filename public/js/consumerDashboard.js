function consumerDashboard()
{
    const session_id=sessionStorage.getItem("session_id");
    
    $.post("/fetchUser",
    {
        session_id:session_id
    },
    (data)=>{
       const user_id=sessionStorage.setItem("user_id", data[0].user_id)
        document.getElementById("name").innerText=data[0].user_name;
        document.getElementById("phone").innerText=data[0].user_phone;
    })    
}

function updateBillList(){
    const user_id=sessionStorage.getItem("user_id");
    const monthStart= document.getElementById("monthSelectStart").value;
    const yearStart= document.getElementById("yearSelectStart").value;
    const monthEnd= document.getElementById("monthSelectEnd").value;
    const yearEnd= document.getElementById("yearSelectEnd").value;
    
    if (
        monthStart == monthEnd &&yearStart <= yearEnd && monthStart!=""&&yearStart!=""&&monthEnd!=""&&yearEnd!=""||
        monthStart > monthEnd &&yearStart < yearEnd && monthStart!=""&&yearStart!=""&&monthEnd!=""&&yearEnd!=""||
        monthStart < monthEnd &&yearStart <= yearEnd && monthStart!=""&&yearStart!=""&&monthEnd!=""&&yearEnd!=""
        ){
            $.post("/fetchBills",
            {
                user_id:user_id,
                FormData:`${yearStart}-${monthStart}-05`,
                ToData:`${yearEnd}-${monthEnd}-05`
            },(data)=>{
                let bill_data="";
                let s=1;
                let paidstatus;
                for (let i = 0; i < data.length; i++) {
                    const monthsName=["Jan","Feb","March","April","May","Jun","July","Aug","Sep","Oct","Nov","Dec"]
                    const date=new Date(data[i].bill_generated_date);
                    const month=monthsName[date.getMonth()];
                    const year=date.getFullYear();
                    if (data[i].paid_status==1) {
                        paidstatus="paid";
                    } else {
                        paidstatus="Not-paid";
                    }
                    bill_data +=`<tr>
                    <td>${s}</td>
                    <td>${month}</td>
                    <td>${data[i].consumption_units}</td>
                    <td>${Math.ceil(data[i].amount_due)}</td>
                    <td>${paidstatus}</td>
                    <td><input type="button" value="Pay" ${data[i].paid_status==1 ?'disabled':''}/></td>
                    <td ><input type="button" value="View-Bill" onclick="fetchSingleBill('${data[i].bill_id}')"/></td>
                  </tr>`
                  s++;
                }
                document.getElementById("billTable").innerHTML=bill_data;
                // updateBillList();
            })
        } 
    else {
        alert("Select Valid Months and Years")    
    }
}
function fetchSingleBill(billId) {
    sessionStorage.setItem("bid", billId);
    console.log("fetching");
    window.location.href = `/fetchSingleBill`;
  }

function showUserInfoModal() {
    const user_id=sessionStorage.getItem('user_id');
    const session_id=sessionStorage.getItem("session_id");
    $.post("/consumerUserinfo",
    {
        session_id:session_id
    },
    (data)=>{
        if(data[0].user_id == user_id){
            const details = `<tr>
            <th><label for="name">Name</label></th>
            <td><input type="text" name="" id="user_name" value="${data[0].user_name}" disabled></td>
        </tr>
        <tr>
            <th><label for="name">User ID</label></th>
            <td><input type="text" name="" id="user_id" value="${data[0].user_id}" disabled></td>
        </tr>
        <tr>
            <th><label for="name">Phone</label></th>
            <td><input type="tel" name="" id="user_phone" value="${data[0].user_phone}" disabled></td>
        </tr>
        <tr>
            <th><label for="name">Address</label></th>
            <td><textarea name="user_address" id="user_address" cols="25" rows="3" disabled>${data[0].user_address}</textarea></td>
        </tr>`;
    
        document.getElementById('userDetailsModal').innerHTML = details;
          } 
        // Show the modal
        $('#userModal').modal('show');
    });
}

function closeButton(){
    document.getElementById('after').style.display = 'none'
    document.getElementById('before').style.display = 'inline-block'
  }
  
  function editUser(){
    document.getElementById('user_name').removeAttribute('disabled')
    document.getElementById('user_phone').removeAttribute('disabled')
    document.getElementById('user_address').removeAttribute('disabled')
    document.getElementById('after').style.display = 'inline-block'
    document.getElementById('before').style.display = 'none'
    
  }
  
  function saveUser(){
    const user_name = document.getElementById('user_name').value
    const user_phone =document.getElementById('user_phone').value
    const user_address =document.getElementById('user_address').value
    const user_id =document.getElementById('user_id').value
  
    $.post('/saveUsers',{
        user_name : user_name,
        user_id : user_id,
        user_phone : user_phone,
        user_address : user_address
    },
    (data)=>{
      if(data){
        location.reload();
        const sessionId=sessionStorage.getItem('session_id'); 
        window.location.href = `/consumerdashboard?s=${sessionId}`
      }
        
    })
  }
  
  function cancelUser(){
    document.getElementById('user_name').disabled = true
    document.getElementById('user_address').disabled = true
    document.getElementById('user_phone').disabled = true
    document.getElementById('after').style.display = 'none'
    document.getElementById('before').style.display = 'inline-block'
    showUserInfoModal();
  }
  