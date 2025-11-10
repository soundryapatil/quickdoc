const React = require('react');

const Link = ({ to, children, ...rest }) => React.createElement('a', { href: to, ...rest }, children);
const BrowserRouter = ({ children }) => React.createElement(React.Fragment, null, children);
const MemoryRouter = BrowserRouter;
const Routes = ({ children }) => React.createElement(React.Fragment, null, children);
const Route = ({ element }) => element || null;
const Outlet = () => React.createElement(React.Fragment, null, null);
const Navigate = ({ to }) => null;
const useSearchParams = () => [new URLSearchParams(''), () => {}];
const useNavigate = () => () => {};
const useLocation = () => ({ pathname: '/' });

module.exports = { Link, BrowserRouter, MemoryRouter, Routes, Route, Outlet, Navigate, useSearchParams, useNavigate, useLocation };
