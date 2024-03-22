'use client'

import React, { useState } from 'react'

import Image from 'next/image';

interface WriteCardProps {
    iconPath: string;
    title: string;
    description: string;
    disabled: boolean;
}

const WriteCard: React.FC<WriteCardProps> = ({
    iconPath,
    title,
    description,
    disabled
}) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div
                onClick={handleClick}
                className={`
                    flex 
                    flex-col 
                    items-start 
                    justify-between 
                    p-4 
                    px-4 
                    h-[9.5rem] 
                    rounded-xl
                    border 
                    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} 
                    flex-grow
                    flex-basis-0 
                    duration-150 
                    ease-in 
                    transition-border 
                    border-border3 
                    bg-white
                    hover:border-textGray3 
                    hover:scale-[1.015] 
                    shadow-feint
                    ${disabled && 'opacity-50'}
                    ${disabled && 'cursor-not-allowed'}
                `}
            >
                {/* Icon Path*/}
                <Image
                    src={iconPath}
                    width={18}
                    height={18}
                    alt='icon'
                />

                {/* Title and Description */}
                <div>
                    <span className="block text-md font-semibold mb-0.5">
                        {title}
                    </span>
                    <span className="block text-sm text-textGray">
                        {description}
                    </span>
                    <span className="block text-xs text-textGray mt-0.5">
                        In progress
                    </span>
                    
                </div>
            </div>
            
        </>
    )
}

export default WriteCard