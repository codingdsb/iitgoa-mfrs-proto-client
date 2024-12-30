import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/store";

export default function Navbar() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const logoutUser = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/auth");
  };

  return (
    <header className='flex h-20 w-full shrink-0 items-center px-4 md:px-6'>
      <Sheet>
        <nav>
        <SheetTrigger asChild>
          <div className="mobile_nav">
            <Button variant='outline' size='icon' className='lg:hidden'>
              <MenuIcon className='h-6 w-6' />
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
            <div className=""><img src="/logo-full.png"></img></div>
          </div>
        </SheetTrigger> 
        </nav>
        <SheetContent side='left'>
          <SheetHeader>
            <img src='/logo-full.png'  className='left-0 ' />
          </SheetHeader>
          <div className='grid gap-2 py-6'>
            <SheetClose asChild>
              <Link
                to='/'
                className='flex w-full items-center py-2 text-lg font-semibold'
              >
                Home
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                to='/announcements'
                className='flex w-full items-center py-2 text-lg font-semibold'
              >
                Announcements
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                to='/polls'
                className='flex w-full items-center py-2 text-lg font-semibold'
              >
                Polls
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                to='/feedback'
                className='flex w-full items-center py-2 text-lg font-semibold'
              >
                Your Feedback
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                to='/suggest'
                className='flex w-full items-center py-2 text-lg font-semibold'
              >
                Your Suggestion
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                to='/full-menu'
                className='flex w-full items-center py-2 text-lg font-semibold'
              >
                See Full Menu
              </Link>
            </SheetClose>
            {user.isAdmin || user.isSuperAdmin ? (
              <SheetClose asChild>
                <Link
                  to='/admin/home'
                  className='flex w-full items-center py-2 text-lg font-semibold'
                >
                  Admin Dashboard
                </Link>
              </SheetClose>
            ) : null}
            <Button onClick={logoutUser} variant='destructive'>
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <nav className='ml-auto hidden lg:flex gap-6 pc_nav'>
        <div>
      <Link to='#' className=''>
        <img src='/logo.jpeg' className=' w-[60px] ' />
        <span className='sr-only'>Mess FRS IIT Goa</span>
      </Link>
      </div>
      <div>
        <Link
          to='/'
          className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
        >
          Home
        </Link>
        <Link
          to='/announcements'
          className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
        >
          Announcements
        </Link>
        <Link
          to='/polls'
          className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
        >
          Polls
        </Link>
        <Link
          to='/feedback'
          className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
        >
          Your Feedback
        </Link>
        <Link
          to='/suggest'
          className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
        >
          Your Suggestion
        </Link>
        <Link
          to='/full-menu'
          className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
        >
          See Full Menu
        </Link>
        {user.isAdmin || user.isSuperAdmin ? (
          <Link
            to='/admin/home'
            className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
          >
            Admin Dashboard
          </Link>
        ) : null}
        <Button onClick={logoutUser} variant='destructive'>
          Logout
        </Button>
        </div>
      </nav>
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='4' x2='20' y1='12' y2='12' />
      <line x1='4' x2='20' y1='6' y2='6' />
      <line x1='4' x2='20' y1='18' y2='18' />
    </svg>
  );
}
