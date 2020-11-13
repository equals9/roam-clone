const generateBlock = (nodeId, parentId, depth, position) => ({
  nodeId,
  value: "",
  children: null,
  references: [],
  isActive: true,
  depth: depth || 0,
  position: position || Date.now() * 100,
  parentId,
});

const findChildren = (tree, depth, index) => {
  const res = [];
  let nextInd = index + 1;

  while (tree[nextInd] && tree[nextInd].depth > tree[index].depth) {
    res.push(nextInd);
    nextInd++;
  }

  return res;
};

export default (state, action) => {
  switch (action.type) {
    case "SET_TREE": {
      return action.tree;
    }
    case "ADD_NEW_BLOCK": {
      let newTree = state.slice();
      newTree.splice(
        action.index,
        0,
        generateBlock(
          action.nodeId,
          action.parentId,
          action.depth,
          action.position
        )
      );
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
    case "INCREASE_BLOCK_DEPTH": {
      let newTree = state.slice();
      const currentDepth = newTree[action.index].depth;
      const childrenIndices = findChildren(newTree, currentDepth, action.index);
      childrenIndices.forEach((childIndex) => {
        newTree[childIndex].depth += 1;
      });

      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        depth: currentDepth + 1,
      });

      return newTree;
    }
    case "DECREASE_BLOCK_DEPTH": {
      let newTree = state.slice();
      const currentDepth = newTree[action.index].depth;
      const childrenIndices = findChildren(newTree, currentDepth, action.index);
      childrenIndices.forEach((childIndex) => {
        newTree[childIndex].depth -= 1;
      });
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        depth: currentDepth - 1,
      });

      return newTree;
    }
    case "SET_BLOCK_PARENT": {
      let newTree = state.slice();
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        parentId: action.parentId,
      });
      return newTree;
    }
    case "SET_BLOCK_ACTIVE": {
      let newTree = state.slice();

      // Deactivate the current active block
      const currentActive = newTree.findIndex((block) => block.isActive);
      if(currentActive !== -1) {
        newTree.splice(currentActive, 1, {
          ...newTree[currentActive],
          isActive: false,
        });
      }

      // Set the desired block as active
      newTree.splice(action.index, 1, {
        ...newTree[action.index],
        isActive: true,
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
};
