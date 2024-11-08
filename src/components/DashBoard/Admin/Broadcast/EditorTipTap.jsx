import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import { BubbleMenu, EditorProvider, useCurrentEditor, NodeViewWrapper } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useCallback, useMemo } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faBold, faItalic, faLink, faListOl, faListUl, faRedo, faStrikethrough, faTextSlash, faUnderline, faUndo } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { selectAllFunds } from 'Slices/DashboardUtilities/fundsSlice';
import { useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
// import Link from '@tiptap/extension-link'
import { customFetch } from 'utils/customFetch';

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  const { t } = useTranslation();
  const funds = useSelector(selectAllFunds)

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        customFetch(
          "https://api.imgbb.com/1/upload?key=7d3bd8f0aa247cf062f5cacc0a0983f8",
          {
            method: "POST",
            body: formData
          }
        )
          .then((response) => response.json())
          .then((result) => {
            editor.chain().focus().setImage({ src: result.data.url }).run();
          })
          .catch((error) => {
            //toast
            console.error("Error:", error);
          });
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  if (!editor) {
    return null;
  }
  const getValue = () => editor.getAttributes("heading")?.level || "p"

  return (
    <div className="control-group">
      <div className="button-group w-100">
        {
          <select value={getValue()} onChange={e => e.target.value === "p" ?
            editor.chain().focus().setParagraph().run()
            :
            editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) }).run()
          }>
            <option value="p">Parrafo</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
            <option value="5">H5</option>
            <option value="6">H6</option>
          </select>
        }
        <div className="menu-divider">
          &nbsp;
        </div>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faUnderline} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </button>
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          data-testid="setColor"
        />
        <div className="menu-divider">
          &nbsp;
        </div>
        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faAlignCenter} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faAlignJustify} />
        </button>
        <div className="menu-divider">
          &nbsp;
        </div>
        {/* <button 
        type='button'
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          Parrafo
        </button>
        <button 
        type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button 
        type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button 
        type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <button 
        type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          H4
        </button>
        <button 
        type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          H5
        </button>
        <button 
        type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          H6
        </button> */}
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faListUl} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <FontAwesomeIcon icon={faListOl} />
        </button>

        <button
          type='button' onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>
          <FontAwesomeIcon icon={faLink} />
        </button>
        {
          editor.isActive('link') &&
          <button
            type='button' onClick={() => editor.chain().focus().unsetLink().run()}
          >
            Eliminar vinculo
          </button>
        }
        <button
          type='button' onClick={addImage}>
          <FontAwesomeIcon icon={faImage} />
        </button>
        <div className="menu-divider">
          &nbsp;
        </div>
        <button
          type='button'
          onClick={() => editor.chain().focus().insertContent(`<span data-text-interpolation-type="${"username"}"></span>`).run()}
        >
          {t("username")}
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().insertContent(`<span data-text-interpolation-type="${"client"}"></span>`).run()}
        >
          {t("Client Name")}
        </button>
        {/* {
          funds.map(fund =>
            <button
              type='button'
              onClick={() => editor.chain().focus().insertContent(`<span data-text-interpolation-type="stake_fund_${fund.id}"></span>`).run()}
            >
              {t(`Fund "{{fundName}}" stake`, { fundName: fund.name })}
            </button>
          )
        } */}
        {
          funds.length > 0 &&
          <>
            <select
              style={{ width: "12ch" }}
              value=""
              onChange={e =>
                e.target.value === "accountBalance" ?
                  editor.chain().focus().insertContent(`U$D <span data-text-interpolation-type="${"accountBalance"}"></span>`).run()
                  :
                  editor.chain().focus().insertContent(`${e.target.value.includes("balance_fund") ? `${t("U$S")} ` : ""}<span data-text-interpolation-type="${e.target.value}"></span>${e.target.value.includes("stake_fund") ? ` ${t("shares")}` : ""}`).run()
              }>
              <option value="" disabled>
                {t("Holdings")}
              </option>
              <option value="accountBalance">
                {t("accountBalance")} (U$D)
              </option>
              {
                funds.map(fund =>
                  <React.Fragment key={fund.id}>
                    <option value={`stake_fund_${fund.id}`}>
                      {t(`{{fundName}}`, { fundName: fund.name })} ({t("Shares")})
                    </option>
                    <option value={`balance_fund_${fund.id}`}>
                      {t(`{{fundName}}`, { fundName: fund.name })} ({t("U$S")})
                    </option>
                  </React.Fragment>
                )
              }
            </select>
            <select
              style={{ width: "19ch" }}
              value=""
              onChange={e =>
                editor.chain().focus().insertContent(`${t("US$")} <span data-text-interpolation-type="share_price_fund_${e.target.value}"></span>`).run()
              }>
              <option value="" disabled>
                {t("Share price")}
              </option>
              {
                funds.map(fund =>
                  <option value={fund.id} key={fund.id}>
                    {t(`{{fundName}}`, { fundName: fund.name })}, U$S {fund.sharePrice}
                  </option>
                )
              }
            </select>
          </>
        }

        <button
          type='button' className="ms-auto" onClick={() => editor.chain().focus().clearNodes().run()}>
          <FontAwesomeIcon icon={faTextSlash} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
    </div >
  );
};

const Tag = (tag = "username", customTranslate) => Node.create({
  name: tag,
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,
  addAttributes() {
    return {
      text: {
        default: '',
      },
    };
  },
  parseHTML() {
    return [{
      tag: `span[data-text-interpolation-type="${tag}"]`,
    }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-text-interpolation-type': tag })];
  },
  addNodeView() {
    return ReactNodeViewRenderer((props) =>
      <GenericNodeViewComponent {...props} translationKey={tag} customTranslate={customTranslate} />
    );
  },
});

const GenericNodeViewComponent = ({ translationKey, customTranslate }) => {
  const { t } = useTranslation();
  return (
    <NodeViewWrapper>
      {customTranslate ? customTranslate : t(translationKey)}
    </NodeViewWrapper>
  );
};

export const EditorTipTap = ({ content, setContent }) => {
  const handleUpdate = ({ editor }) => {
    setContent(editor.getHTML());
  };

  const { t } = useTranslation();

  const funds = useSelector(selectAllFunds)

  const extensions = useMemo(() => [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Image.configure({
      inline: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
    }),
    Tag("username"),
    Tag("client", t("Client Name")),
    Tag("accountBalance"),
    Tag("stake_fund_id"),
    ...funds.map(fund => Tag(`stake_fund_${fund.id}`, t(`"{{fundName}}" stake (Shares)`, { fundName: fund.name }))),
    ...funds.map(fund => Tag(`balance_fund_${fund.id}`, t(`"{{fundName}}" stake (U$S)`, { fundName: fund.name }))),
    ...funds.map(fund => Tag(`share_price_fund_${fund.id}`, t(`"{{fundName}}" share price`, { fundName: fund.name, sharePrice: fund.sharePrice }))),
    // Link.configure({
    //   openOnClick: false,
    //   autolink: true,
    //   defaultProtocol: 'https',
    // })
  ], [funds, t])

  return (
    <>
      <EditorProvider editorProps={{ attributes: { class: content === "<p></p>" ? "" : "editor-has-value" } }} slotBefore={<MenuBar />} extensions={extensions} content={content} onUpdate={handleUpdate}>
        {/* 
      <FloatingMenu editor={null}>
        <ContentFloatingMenu />
      </FloatingMenu>
       */}
        <BubbleMenu editor={null}>
          <ContentBubbleMenu />
        </BubbleMenu>
      </EditorProvider>
      {
        content === "<p></p>" &&
        <Form.Text className='validation-text text-red'>
          {t("This field is required")}
        </Form.Text>
      }
    </>

  );
};

const ContentBubbleMenu = () => {
  const { editor } = useCurrentEditor();
  return (
    <>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <FontAwesomeIcon icon={faStrikethrough} />
      </button>
      {/* <button 
        type='button'
      type='button'
        onClick={() => editor.chain().focus().insertContent('<span data-text-interpolation data-interpolation="username">username</span>').run()}
      >
        Insert Badge
      </button> */}
    </>
  );
};


// const ContentFloatingMenu = () => {
//   const { editor } = useCurrentEditor();
//   return (<div className="floating-menu">
//     <button
//       type = 'button'
//       onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//       className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
//     >
//       H1
//     </button>
//     <button
//       type = 'button'
//       onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//       className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
//     >
//       H2
//     </button>
//     <button
//       type = 'button'
//       onClick={() => editor.chain().focus().toggleBulletList().run()}
//       className={editor.isActive('bulletList') ? 'is-active' : ''}
//     >
//       Bullet list
//     </button>
//   </div>)
// }