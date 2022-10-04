import menuItems from './menuDefinition';
import { MenuItem } from './MenuItem';

function toggleMobileMenu(state:any, setState: (arg0:any)=>void) {
  const { menuOpen, containerOpen } = state;
  const mO = !menuOpen;
  const cO = !containerOpen;
  setState({ menuOpen: mO, containerOpen: cO });
}

function handleKeyMenu(evt: { key: string; }, state:any, setState: (arg0:any)=>void): (void | null) {
  if (evt.key === 'Enter') return toggleMobileMenu(state, setState);
  return null;
}

interface InavLinksProps {
  style:string, auth:any, setState:(arg0:any)=>void, dispatch:(arg0:any)=>void
}
export const NavLinks = ({ style, auth, setState, dispatch }: InavLinksProps) => {
  return (
      <div className={`navigation ${style}`}>
        {/* {menuItems.map((menu, index) => (this.menuUtils.menuItem(menu, index, this)))} */}
        {menuItems.map((menuItem, index) => <MenuItem dispatch={dispatch} menuItem={menuItem} index={index} auth={auth} setState={setState}/>)}
      </div>
  );
};

interface IdrawerHeaderProps {
  style:string, state:any, setState: (arg0:any)=>void
}
export const DrawerHeader = ({ style, state, setState }: IdrawerHeaderProps) => {
  return (
      <header className="header">
        <div className="header__logo">
          <img
            className="header__logo--picture"
            src="https://dl.dropbox.com/s/befh330hypey44l/fish%20with%20color.png?dl=0"
            alt="The Jesus Fish with a multi-coloured background"
          />
          <span
            className={`${style} header__mobile-menu`}
            onClick={()=> toggleMobileMenu(state, setState)}
            onKeyPress={(evt) => handleKeyMenu(evt, state, setState)}
            tabIndex={0}
            role="button"
          >
            <span className="header__mobile-menu--icon" />
          </span>
          <span className="header__title">
            <h2>Change In Christ</h2>
          </span>
        </div>
      </header>
  );
};

interface IdrawerContainerProps {
  menuOpen:boolean, state:any, setState: (arg0:any)=>void, auth:any, dispatch:(arg0:any)=>void
}
export const DrawerContainer = (props:IdrawerContainerProps) => {
  const { menuOpen, state, setState, auth, dispatch } = props;
  const style = `${menuOpen ? 'open' : 'close'}`;
  return (
          <div className={`${style} sidebar`}>
            <div className="sidebar__content">
                <DrawerHeader style={style} state={state} setState={setState}/>
              <NavLinks style={style} auth={auth} setState={setState} dispatch={dispatch}/>
            </div>
          </div>
  );
};
