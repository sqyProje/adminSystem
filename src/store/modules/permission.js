import { asyncRouterMap, constantRouterMap } from '@/router/index';
function jsonsdd(jsontree) {
  const newMenuArray= new Array()
  for(let i=0;i<jsontree.length;i++){
    let two = jsontree[i].childMenu
    newMenuArray.push(jsontree[i])
    if(two && two.length>0){
      for(let j=0;j<two.length;j++){
        newMenuArray.push(two[j])
        let three = two[j].childMenu
        if(three && three.length>0){
          for(let k=0;k<three.length;k++){
            newMenuArray.push(three[k])
            let four = three[k].childMenu
            if(four && four.length>0){
              for(let m=0;m<four.length;m++){
                newMenuArray.push(four[m])
              }
            }
          }
        }
      }
    }
  }
  return newMenuArray
}

//判断是否有权限访问该菜单
function hasPermission(menus, route) {
  if (route.name) {
    let currMenu = getMenu(route.name,jsonsdd(menus));
  //  let currMenu = getMenu(route.name, menus);
    if (currMenu != null) {
      //设置菜单的标题、图标和可见性
      if (currMenu.name != null && currMenu.name !== '') {
        route.meta.title = currMenu.name;
      }
      if (currMenu.imgicon != null && currMenu.imgicon !== '') {
        route.meta.icon = currMenu.imgicon;
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort;
      }
      return true;
    }else {
      if (route.hidden !== undefined && route.hidden === true) {
        return true;
      } else {
        return false;
      }
    }
  }else {
    return true
  }
}

//根据路由名称获取菜单
/*function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    let arrayMenu=[]
    arrayMenu.push(menus[i]);
    if(menus[i].childMenu) {
      for (let j = 0; j < menus[i].childMenu.length; j++) {
        arrayMenu.push(menus[i].childMenu[j])
        for (let i = 0; i < arrayMenu.length; i++) {
          let menu = arrayMenu[i];
          if (name===menu.en_name) {
            return menu;
          }
        }
      }
    }else{
      let menu = menus[i];
      if (name===menu.en_name) {
        return menu;
      }
    }
  }
  return null;
}*/
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (name===menu.en_name) {
      return menu;
    }
  }
  return null;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menus } = data;
        const accessedRouters = asyncRouterMap.filter(v => {
          //admin帐号直接返回所有菜单
          // if(username==='admin') return true;
          if (hasPermission(menus, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(menus, child)) {
                  if(child.children&& child.children.length>0){
                    child.children = child.children.filter(otherthree=>{
                      if(hasPermission(menus,otherthree)){
                        if(otherthree.children && otherthree.children.length>0){
                          otherthree.children = otherthree.children.filter(otherfour=>{
                            if(hasPermission(menus,otherfour)) {
                              return otherfour
                            }
                          })
                        }
                        return otherthree
                      }
                      return false
                    })
                  }
                  return child
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return false;
        });
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;

