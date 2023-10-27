function consumerlogin(){

    const phone=document.getElementById("phone").value.trim();
    const password=document.getElementById("password").value.trim();
    if (phone.length == 10 && password.length > 0)
    {
        $.post("/login",
        {
            phone:phone,
            password:password
        },(data)=>
        {
            const session_id=data;
            sessionStorage.setItem("session_id",session_id);
            window.location.href=`/consumerdashboard?s=${session_id}`;
        })
    }
    else {
         console.log("err");
    }
}