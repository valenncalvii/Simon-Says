//promesa para manejar el tiempo en ms
export default function TimeOut(ms){
    return new Promise(resolve =>setTimeout(resolve, ms));
}