import axios from "axios";
let loginCheck = (router, next) => {
    let token = localStorage.getItem("token");
    let data = {
        headers: {
            "X-Access-Token": JSON.parse(token),
        },
    };
    let uri = `http://` + window.location.hostname + `:4000/user/welcome`;
    axios
        .post(uri, {}, data)
        .then((response) => {
            // console.log("Login Successful: ", 
            response.data.username
            // );
            // return true;
            next();
        })
        .catch((e) => {
            console.log("Login failed");
            console.log(e);
            // console.log("this.$router.currentRoute:", router.currentRoute);
            // router.redirect('/login');
            // return res.status(401).location('/login').end();
            router.currentRoute.name != "Login" ? router.push({ name: "Login" }) : {};
        });
}

export default loginCheck;