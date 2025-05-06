import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => (
  <div className="container-fluid">
    <div className="row">
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column p-3">
            <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/students">Students</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/drives">Drives</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/reports">Reports</Link></li>
          </ul>
        </div>
      </nav>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <Outlet />
      </main>
    </div>
  </div>
);

export default Layout;