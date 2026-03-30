"use client"

import { Unplug, Search } from "lucide-react"
import React from "react"
import UserButton from "@/modules/authentication/components/uesr-button"
import { UserProps } from "../types"
import SearchBar from "./SearchBar"
import InviteMemebers from "./InviteMemebers"
import WorkSpace from "./WorkSpace"

interface Props {
    user: UserProps
}

const Header = ({ user }: Props) => {
    return (
        <header className="grid grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-hidden p-2 border">
            <div className="col-span-2 flex items-center justify-between space-x-2 hover:cursor-pointer hover:opacity-80 ml-4">
                <Unplug size={28} style={{ color: "#818cf8" }} />
            </div>
            <div className="col-span-1 flex items-center justify-between space-x-2">
                <div className="border-animated relative p-[1px] rounded flex-1 self-strech overflow-hidden flex items-center justify-center" aria-hidden={true}>
                    <SearchBar />
                </div>
            </div>
            <div className="col-span-2 flex items-center justify-end space-x-2 hover:cursor-pointer hover:opacity-80">
                <InviteMemebers />
                <WorkSpace />
                <UserButton user={user} size="sm" />
            </div>
        </header>
    )
}

export default Header