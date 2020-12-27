import React from 'react';
import { DatePicker } from 'antd';

const disabledDate = current => current && current.year() < 1912;

function DatePickerComponent({ taiwanCalendar = false, ...props }) {
  const onClick = (selectorOrElement, eventHandler) => {
    requestAnimationFrame(() => {
      let el =
        typeof selectorOrElement === 'string'
          ? document.querySelector(selectorOrElement)
          : selectorOrElement;

      if (el) {
        el.addEventListener('click', eventHandler);
      }
    });
  };

  /**
   * 修改 body 的年份
   */
  const modifyCellToTaiwanYear = () => {
    requestAnimationFrame(() => {
      document
        .querySelectorAll('td[class*=ant-calendar-year-panel-cell]')
        .forEach(yearEl => {
          const taiwanYear = `${+yearEl.getAttribute('title') - 1911}年`;
          const yearCellEl = yearEl.querySelector('a');

          yearEl.setAttribute('title', taiwanYear);
          yearCellEl.innerText = taiwanYear;
          onClick(yearEl, () => {
            modifyYearSelectToTaiwanYear();
            modifyYearContentToTaiwanYear();
          });

          if (
            yearEl.classList.contains(
              'ant-calendar-year-panel-last-decade-cell'
            ) ||
            yearEl.classList.contains(
              'ant-calendar-year-panel-next-decade-cell'
            )
          ) {
            onClick(yearEl, () => {
              modifyCellToTaiwanYear();
            });
          }
        });

      document.querySelector(
        'span.ant-calendar-year-panel-decade-select-content'
      ).innerText = '選擇年份';
    });
  };

  /**
   * 修改在選擇日其實 header 的年份
   */
  const modifyYearSelectToTaiwanYear = () => {
    requestAnimationFrame(() => {
      const yearSelectEl = document.querySelector('a.ant-calendar-year-select');

      if (yearSelectEl && yearSelectEl.innerText.indexOf('民國') < 0) {
        const taiwanYear = +yearSelectEl.innerText.replace(/\D/g, '') - 1911;
        yearSelectEl.innerText = `民國 ${taiwanYear} 年`;
      }
    });
  };

  /**
   * 修改在選擇月份時 header 的年份
   */
  const modifyYearContentToTaiwanYear = () => {
    requestAnimationFrame(() => {
      const yearContentEl = document.querySelector(
        'span.ant-calendar-month-panel-year-select-content'
      );

      if (yearContentEl && yearContentEl.innerText.indexOf('民國') < 0) {
        const taiwanYear = +yearContentEl.innerText - 1911;
        yearContentEl.innerText = `民國 ${taiwanYear} 年`;
      }
    });
  };

  /**
   * 選擇年份視窗出現後再點一次選擇年份
   */
  const handleYearSelectClick = () => {
    onClick('span.ant-calendar-year-panel-decade-select-content', () =>
      requestAnimationFrame(() => {
        const modifyCenturyCellValue = () => {
          document
            .querySelectorAll('a.ant-calendar-decade-panel-decade')
            .forEach(cellEl => {
              const [start, end] = cellEl.innerText.split('-');
              cellEl.innerText = `${+start - 1911}-${+end - 1911}`;
            });
        };

        const centuryEl = document.querySelector(
          'div.ant-calendar-decade-panel-century'
        );

        centuryEl.innerText = '選擇年份';

        const nextBtn = document.querySelector(
          'a.ant-calendar-decade-panel-next-century-btn'
        );
        const prevBtn = document.querySelector(
          'a.ant-calendar-decade-panel-prev-century-btn'
        );

        onClick(prevBtn, () =>
          requestAnimationFrame(() => modifyCenturyCellValue())
        );
        onClick(nextBtn, () =>
          requestAnimationFrame(() => modifyCenturyCellValue())
        );

        modifyCenturyCellValue();
      })
    );
  };

  /**
   * 打開日期選擇框再點年份，切換前十年和後十年的按鈕
   */
  const handleDecadeBtnClick = () => {
    onClick('a.ant-calendar-year-panel-prev-decade-btn', () =>
      modifyCellToTaiwanYear()
    );

    onClick('a.ant-calendar-year-panel-next-decade-btn', () =>
      modifyCellToTaiwanYear()
    );
  };

  /**
   * 打開日期選擇框後，切換上一年和下一年的按鈕
   */
  const handleYearBtnClick = () => {
    onClick('a.ant-calendar-prev-year-btn', () =>
      modifyYearSelectToTaiwanYear()
    );

    onClick('a.ant-calendar-next-year-btn', () =>
      modifyYearSelectToTaiwanYear()
    );
  };

  /**
   * 打開日期選擇框後再點月份，點擊某個月份
   */
  const handleMonthCellClick = () => {
    requestAnimationFrame(() => {
      document
        .querySelectorAll('a.ant-calendar-month-panel-month')
        .forEach(monthEl =>
          onClick(monthEl, () => modifyYearSelectToTaiwanYear())
        );
    });
  };

  const handleMonthBtnClick = () => {
    onClick('a.ant-calendar-prev-month-btn', () => {
      modifyYearSelectToTaiwanYear();
    });

    onClick('a.ant-calendar-next-month-btn', () => {
      modifyYearSelectToTaiwanYear();
    });
  };

  /**
   * 打開日期選擇框後再點月份，切換上一年和下一年的按鈕
   */
  const handleMonthYearBtnClick = () => {
    onClick('a.ant-calendar-month-select', () => {
      modifyYearContentToTaiwanYear();

      onClick('a.ant-calendar-month-panel-prev-year-btn', () => {
        modifyYearContentToTaiwanYear();
      });

      onClick('a.ant-calendar-month-panel-next-year-btn', () => {
        modifyYearContentToTaiwanYear();
      });

      handleMonthCellClick();
    });
  };

  const onPanelChange = (value, mode) => {
    if (mode === 'year') {
      modifyCellToTaiwanYear();
      handleDecadeBtnClick();
      handleYearSelectClick();
    }
  };

  const onOpenChange = isOpen => {
    if (isOpen) {
      modifyYearSelectToTaiwanYear();
      handleYearBtnClick();
      handleMonthYearBtnClick();
      handleMonthBtnClick();
    }
  };

  return (
    <DatePicker
      {...props}
      {...(taiwanCalendar ? { onOpenChange, onPanelChange, disabledDate } : {})}
    />
  );
}

export default React.memo(
  React.forwardRef((props, ref) => (
    <DatePickerComponent forwardRef={ref} {...props}>
      {props.children}
    </DatePickerComponent>
  ))
);
