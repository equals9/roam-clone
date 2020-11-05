import React from "react";
import { Link, useParams } from "react-router-dom";
import { nanoid } from "nanoid";

import { Block } from "./Block.js";

const DEFAULT_BLOCK = () => ({
  uid: nanoid(10),
  isActive: true,
  value: "",
});

function treeReducer(state, action) {
  switch (action.type) {
    case "ADD_NEW_BLOCK": {
      let newTree = state.slice();
      newTree.splice(action.index, 0, DEFAULT_BLOCK());
      return newTree;
    }
    case "SET_BLOCK_VALUE": {
      let newTree = state.slice();
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        value: action.value,
      });
      return newTree;
    }
    case "SET_BLOCK_ACTIVE": {
      let newTree = state.slice();
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        isActive: true,
      });
      return newTree;
    }
    case "SET_BLOCK_INACTIVE": {
      let newTree = state.slice();
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        isActive: false,
      });
      return newTree;
    }
    case "DELETE_BLOCK": {
      let newTree = state.slice();
      newTree.splice(action.index, 1);
      return newTree;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const Page = ({ id, title }) => {
  const [tree, dispatch] = React.useReducer(treeReducer, [DEFAULT_BLOCK()]);

  const { id: paramId } = useParams();

  console.log({id, paramId})

  const path = `/p/${id || paramId}`;
  const handleChange = (index) => (event) => {
    dispatch({
      type: "SET_BLOCK_VALUE",
      index,
      value: event.target.value,
    });
  };

  const setBlockActive = (index) => {
    const activeBlockIndex = tree.findIndex((block) => block.isActive);
    dispatch({
      type: "SET_BLOCK_INACTIVE",
      index: activeBlockIndex,
    });
    dispatch({
      type: "SET_BLOCK_ACTIVE",
      index,
    });
  };

  return (
    <div className="page">
      <h2>
        <Link to={path}>{title}</Link>
      </h2>
      <ul
        onKeyDown={(e) => {
          const code = e.keyCode ? e.keyCode : e.which;

          const activeBlockIndex = tree.findIndex((block) => block.isActive);
          const blocksCount = tree.length;

          //Enter keycode
          if (code === 13 && !e.shiftKey) {
            e.preventDefault();
            // remove is active from current active block
            dispatch({
              type: "SET_BLOCK_INACTIVE",
              index: activeBlockIndex,
            });
            // and add new block after the cuurent active block
            dispatch({
              type: "ADD_NEW_BLOCK",
              index: activeBlockIndex + 1,
            });
          }
          // Delete keycode
          if (code === 8) {
            if (tree[activeBlockIndex].value === "") {
              if (tree.length !== 1) {
                e.preventDefault();
                dispatch({
                  type: "DELETE_BLOCK",
                  index: activeBlockIndex,
                });
                dispatch({
                  type: "SET_BLOCK_ACTIVE",
                  index: activeBlockIndex - 1,
                });
              }
            }
          }
          // keyboard navigation
          if (e.keyCode === 38) {
            if (blocksCount > 1) {
              e.preventDefault();
              dispatch({
                type: "SET_BLOCK_INACTIVE",
                index: activeBlockIndex,
              });
              dispatch({
                type: "SET_BLOCK_ACTIVE",
                index: (blocksCount + activeBlockIndex - 1) % blocksCount,
              });
            }
          }
          if (e.keyCode === 40) {
            if (blocksCount > 1) {
              e.preventDefault();
              dispatch({
                type: "SET_BLOCK_INACTIVE",
                index: activeBlockIndex,
              });
              dispatch({
                type: "SET_BLOCK_ACTIVE",
                index: (activeBlockIndex + 1) % blocksCount,
              });
            }
          }
        }}
      >
        {tree.map((block, index) => (
          <li key={block.uid}>
            <Block
              block={block}
              handleChange={handleChange(index)}
              setBlockActive={() => setBlockActive(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
