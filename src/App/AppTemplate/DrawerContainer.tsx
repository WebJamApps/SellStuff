import React from 'react';

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
  style:string
}
export const NavLinks = ({ style }: InavLinksProps) => {
  return (
      <div className={`navigation ${style}`}>
        {this.menus.map((menu, index) => (this.menuUtils.menuItem(menu, index, this)))}
      </div>
  );
};

interface IsidebarProps {
  style:string
}
export const Sidebar = ({ style }: IsidebarProps) => {
  return (
      <div className={`${style} sidebar__functions`}>
        {// TODO remove process.env check when feature is working
        /* istanbul ignore next */process.env.NODE_ENV !== 'production'
      ? this.makeForm('Search') : null
        }
        {// TODO remove process.env check when feature is working
        /* istanbul ignore next */process.env.NODE_ENV !== 'production'
      ? this.makeForm('Subscribe') : null
        }
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
  menuOpen:boolean, state:any, setState: (arg0:any)=>void
}
export const DrawerContainer = (props:IdrawerContainerProps) => {
  const { menuOpen, state, setState } = props;
  const style = `${menuOpen ? 'open' : 'close'}`;
  return (
          <div className={`${style} sidebar`}>
            <div className="sidebar__content">
                <DrawerHeader style={style} state={state} setState={setState}/>
              {/* {this.drawerHeader(style)} */}
              <Sidebar style={style}/>
              {/* {this.sidebar(style)} */}
              <NavLinks style={style}/>
              {/* {this.navLinks(style)} */}
            </div>
          </div>
  );
};
