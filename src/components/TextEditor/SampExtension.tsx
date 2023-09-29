import { CommandFunction, MarkExtension, PrimitiveSelection, command, getTextSelection, toggleMark } from "remirror";

// export class SampExtension extends MarkExtension<SampOptions> {
//   // ...

//   @command()
//   toggleSamp(selection?: PrimitiveSelection): CommandFunction {
//     return toggleMark({ type: this.type, selection });
//   }

//   @command()
//   setSamp(selection?: PrimitiveSelection): CommandFunction {
//     return ({ tr, dispatch }) => {
//       const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
//       dispatch?.(tr.addMark(from, to, this.type.create()));

//       return true;
//     };
//   }

//   @command()
//   removeSamp(selection?: PrimitiveSelection): CommandFunction {
//     return ({ tr, dispatch }) => {
//       const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);

//       if (!tr.doc.rangeHasMark(from, to, this.type)) {
//         return false;
//       }

//       dispatch?.(tr.removeMark(from, to, this.type));

//       return true;
//     };
//   }
// }