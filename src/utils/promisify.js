export function promisify(fn){
  return function(){
    var args = Array.prototype.slice.call(arguments, 0);
    return new Promise(function(resolve, reject){
      args.push(function(e, res){
        if(!e){
          resolve(res);
        }else{
          reject(e);
        }
      });
      fn.apply(null, args)
    });
  };
}
