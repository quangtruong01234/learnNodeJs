import app from "../src/app";
const PORT: string | number = process.env.PORT || 3056;
app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`);
});

// process.on('SIGINT',()=>{
//     // notify.send(ping...)
// })
