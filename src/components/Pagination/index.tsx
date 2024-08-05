import { MdDoubleArrow } from "react-icons/md";

import ReactPaginate from "react-paginate";
import React from "react";

export interface IPaginationSelected {
  selected: number;
}
export interface IPagination {
  handlePageClick: (selectedItem: IPaginationSelected) => void;
  meta?: {
    page?: {
      currentPage: number;
      lastPage: number;
    };
  };
}

export default function Pagination({ handlePageClick, meta }: IPagination) {
  return (
    <ReactPaginate
      breakLabel="..."
      previousLabel={<></>}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      disabledLinkClassName="text-gray-400"
      forcePage={meta?.page?.currentPage ? meta?.page?.currentPage - 1 : 0}
      pageCount={meta?.page?.lastPage || 0}
      nextLabel={<MdDoubleArrow size={26} />}
      onPageChange={handlePageClick}
      containerClassName="pb-4 pt-8 pl-2 flex items-center gap-6 text-white overflow-auto justify-center"
      activeClassName="text-primary"
      pageLinkClassName="flex justify-center items-center"
      nextLinkClassName="text-primary flex justify-center items-center"
      renderOnZeroPageCount={() => null}
    />
  );
}
