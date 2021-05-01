// import axios from "axios";
// import Overlay from "components/Overlay";
// import { useLayoutDispatch, useLayoutState } from "context/layout.context";
// import { HIDE_MODAL } from "context/types";
// import { AnimatePresence, motion } from "framer-motion";
// import { popUp } from "lib/animations";
// import { usePaginatedPosts } from "lib/hooks";

// const DeleteModal = () => {
//   const { showDeleteModal, postId } = useLayoutState();
//   const { mutate: paginatedPostsMutate } = usePaginatedPosts("/api/posts/feed");

//   const dispatch = useLayoutDispatch();
//   console.log("rendered");

//   const handleDelete = async (e: any) => {
//     e.stopPropagation();
//     await axios.delete(`/api/posts/${postId}/`);
//     paginatedPostsMutate();
//     dispatch({
//       type: HIDE_MODAL,
//     });
//   };
//   return (
//     <AnimatePresence>
//       {showDeleteModal ? (
//         <Overlay>
//           <motion.div
//             className="px-6 py-4 rounded-lg shadow-2xl bg-dark-700"
//             variants={popUp}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//           >
//             <div className="flex flex-col items-center p-2 space-y-6 rounded-2xl">
//               <h1 className="text-2xl font-semibold">Are you sure?</h1>
//               <p className="w-7/12">
//                 This can’t be undone and it will be removed from your profile,
//                 the timeline of any accounts that follow you{" "}
//               </p>
//               <div className="flex flex-row text-lg space-x-7">
//                 <button
//                   className="p-2 px-4 rounded-full bg-dark-500"
//                   onClick={(e) => {
//                     dispatch({
//                       type: HIDE_MODAL,
//                     });
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="p-2 px-4 bg-pink-700 rounded-full"
//                   onClick={(e) => {
//                     handleDelete(e);
//                   }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </Overlay>
//       ) : null}
//     </AnimatePresence>
//   );
// };

export {};
// export default DeleteModal;
