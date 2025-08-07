import {
  EditStringField,
  EntryListInput,
  Pagination,
  SearchBox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@/components";
import {
  adminTopicAddApi,
  adminTopicEditApi,
  getAdminTopicsApi,
} from "@/features/admin/api/adminTopicApi";
import { changePage } from "@/features/admin/slice/adminTopicSlice";
import { usePaginatedData } from "@/hooks";
import { AdminLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { TopicNameValidationRule } from "@/utils/validationRules";
import { useState } from "react";
import { MdEdit, MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const PAGE_SIZE = 5;

const AdminTopicsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selected, setSelected] = useState<string | null>();
  const { topics, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminTopic
  );

  const {
    nextPage,
    paginatedData,
    previousPage,
    search,
    searchHandler,
    refreshHandler,
  } = usePaginatedData({
    data: topics,
    currentPage,
    changePageApi: changePage,
    getDataApi: getAdminTopicsApi,
    size: PAGE_SIZE,
  });

  const addTopic = (topicName: string) => {
    dispatch(adminTopicAddApi(topicName));
  };

  const editTopic = (topicId: string, topicName: string) => {
    dispatch(adminTopicEditApi({ topicId, topicName }));
  };

  return (
    <AdminLayout>
      <SearchBox
        placeholder="search by category name"
        search={search}
        searchHandler={searchHandler}
      />

      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>
      <EntryListInput
        addEntry={addTopic}
        entryValidationRule={TopicNameValidationRule}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic Name</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton widths={[300, 200]} />
        ) : (
          <TableBody>
            {paginatedData.map(({ _id, topicName }) => (
              <TableRow key={_id}>
                <TableCell>
                  {selected == _id ? (
                    <EditStringField
                      defaultValue={topicName}
                      placeholder="Enter Topic Name"
                      entryValidationRule={TopicNameValidationRule}
                      save={(categoryName) => editTopic(_id, categoryName)}
                      close={() => setSelected(null)}
                    />
                  ) : (
                    topicName
                  )}
                </TableCell>

                <TableCell className="text-3xl text-app-accent">
                  <button onClick={() => setSelected(_id)}>
                    <MdEdit />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </AdminLayout>
  );
};

export default AdminTopicsPage;
