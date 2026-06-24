// window.BASE_URL =
//     location.hostname === "127.0.0.1" ||
//     location.hostname === "localhost"
//         ? ""
//         : "/Saraswat_Academy";

window.BASE_URL = location.hostname.endsWith("github.io")
    ? "/Saraswat_Academy"
    : "";