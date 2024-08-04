'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../public/icons/logo.svg'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const Sidebar = ({user}:SidebarProps) => {
    const pathName = usePathname()
    console.log(pathName)
  return (
    <section className='sidebar'>
        <nav className='flex flex-col gap-4'>
            <Link href='/' className='flex mb-12 cursor-pointer items-center gap-2'>
                <Image
                    src={logo}
                    width={34}
                    height={34}
                    alt='horizon logo'
                    className='size-[24px] max-xl:size-14'
                />
                <h1 className='sidebar-logo'>Horizon</h1>
            </Link>
            {sidebarLinks.map((item)=>{
                const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)
                return(
                <Link href={item.route} key={item.label} className='mb-4'>
                    <span className={cn('sidebar-link',{'bg-bankGradient':isActive})}>
                        <div className='relative size-6'>
                            <Image
                              src={item.imgURL}
                              alt={item.label} 
                              fill
                              className={cn({'brightness-[3] invert-[0]':isActive})} 
                            />
                        </div>
                        <p className={cn('sidebar-label', {'!text-white':isActive})}>{item.label}</p>
                    </span>
                </Link>
                )
            })}
            user
        </nav>
        footer
    </section>
  )
}

export default Sidebar